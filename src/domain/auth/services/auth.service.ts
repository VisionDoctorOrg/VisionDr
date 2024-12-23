import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { AuthMapper } from 'src/application/auth/mappers/auth.mapper';
import { SignupDto } from 'src/application/auth/dtos/signup.dto';
import {
  JwtAuthService,
  UserEmailExistException,
  UserPhoneExistException,
} from 'src/common';
import { AuthProvider, Prisma, Status } from '@prisma/client';
import { User } from 'src/domain/users/entities/user.entity';
import { ResetPasswordDto } from 'src/application/auth/dtos/reset-password.dto';
import { UsersService } from 'src/domain/users/services/users.service';
import { SubscriptionService } from 'src/domain/subscription/services';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private readonly jwtService: JwtAuthService,
    private readonly usersService: UsersService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    try {
      const userDomain = AuthMapper.toDomain(signupDto);

      // Check if passwords match
      if (userDomain.password !== userDomain.confirmPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Hash the password
      userDomain.password = await hash(userDomain.password, 10); 

      let authProvider: AuthProvider;

      // Determine the authentication provider
      if (userDomain.email) {
        authProvider = AuthProvider.EMAIL;
      } else if (userDomain.phoneNumber) {
        authProvider = AuthProvider.PHONENUMBER;
      } else {
        throw new HttpException(
          'Either email or phone number is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if user already exists using both email and phone number
      const existingUser = await this.usersService.findByEmailOrPhone(
        userDomain.email,
        userDomain.phoneNumber,
      );

      // Handle existing user cases
      if (existingUser) {
        if (existingUser.email === userDomain.email) {
          throw new UserEmailExistException('User');
        }

        if (existingUser.phoneNumber === userDomain.phoneNumber) {
          throw new UserPhoneExistException('User');
        }
      }

      // Create the user
      const user = await this.usersService.create({
        ...userDomain,
        authProvider,
      });

      // Automatically create a free subscription plan for the new user
      await this.subscriptionService.initializeSubscription(user.id, {
        amount: 0,
        plan: 'free-plan-id',
      });

      return user;
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'An error occurred, please check your values',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && user.googleId && user.password === null) {
      throw new HttpException(
        'Please sign in with Google or reset your password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user && (await compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async validateUserByEmailOrPhone(
    username: string,
    password: string,
  ): Promise<User | null> {
    // Check if the username is an email (assumes emails contain '@')
    const isEmail = username.includes('@');

    // Find user by email or phone number based on the input
    const user = isEmail
      ? await this.usersService.findByEmailOrPhone(username, null)
      : await this.usersService.findByEmailOrPhone(null, username);

    if (!user) {
      return null;
    }

    // If the user signed up with Google and doesn't have a password, block them
    if (user.googleId && user.password === null) {
      throw new HttpException(
        'Please sign in with Google or reset your password',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the password matches the stored hashed password
    const isPasswordValid = await compare(password, user.password);
    if (isPasswordValid) {
      return user;
    }

    // If no valid password match, return null
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }

  async validateGoogleUser(userData: User): Promise<User> {
    this.logger.debug('Oauth validation starting...');
    const { email, googleId, authProvider, picture } = userData;

    // Try to find user by Google ID
    let user = await this.usersService.findByProviderId(
      googleId,
      authProvider.toUpperCase() as AuthProvider,
    );

    if (!user) {
      this.logger.debug('User notFound by googleId, finding by email');
      // If not found by Google ID, find by email
      user = await this.usersService.findByEmail(email);

      if (user) {
        user.googleId = googleId;
        // user.picture = picture;

        user = await this.usersService.updateUser(user);
        this.logger.debug('User Found by email, updating record', user);
      } else {
        // If user doesn't exist, create a new one
        user = await this.usersService.create({ ...userData, authProvider });
        this.logger.debug(
          'User notFound by email or google, creating record',
          user,
        );
      }
    }

    this.logger.debug('User Found by googleId, returning record');
    return user;
  }

  async validateLinkedInUser(userData: User): Promise<User> {
    this.logger.debug('LinkedInOauth validation starting...');
    const { email, linkedinId, authProvider, picture } = userData;

    let user = await this.usersService.findByProviderId(
      linkedinId,
      authProvider.toUpperCase() as AuthProvider,
    );

    if (!user) {
      this.logger.debug('User notFound by linkedinId, finding by email');

      user = await this.usersService.findByEmail(email);

      if (user) {
        user.linkedinId = linkedinId;
        user.picture = picture;
        user = await this.usersService.updateUser(user);
        this.logger.debug('User Found by email, updating record', user);
      } else {
        user = await this.usersService.create({ ...userData, authProvider });
        this.logger.debug(
          'User notFound by email or linkedin, creating record',
          user,
        );
      }
    }

    this.logger.debug('returning record');
    return user;
  }

  async login(
    identifier: string,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.usersService.findByEmailOrPhone(
      identifier,
      identifier,
    ); 
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const accessToken = this.jwtService.generateAuthToken(user.id, user.email);
    return { user, accessToken };
  }

  async updateUser(user: User): Promise<User> {
    return await this.usersService.updateUser(user); 
  }

  public async resetPassword( 
    resetPasswordDto: ResetPasswordDto,
  ): Promise<User> {
    const user = await this.usersService.findByResetToken(
      resetPasswordDto.token,
    );

    // Check if the token is valid and not expired
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    user.password = await hash(resetPasswordDto.newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.activated = Status.Active;

    return await this.usersService.updateUser(user);
  }

  public async verifyToken(
    token: string,
  ): Promise<User> {
    const user = await this.usersService.findByActivationToken(
      token,
    );

    // Check if the token is valid and not expired
    if (!user || user.tokenExpires < new Date()) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.token = null;
    user.tokenExpires = null;
    user.activated = Status.Active;

    return await this.usersService.updateUser(user);
  }
}
