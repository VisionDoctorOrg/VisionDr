import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidResponse', async: false })
export class isValidResponses implements ValidatorConstraintInterface {
  validate(responses: Record<string, string>[], args: ValidationArguments) {
    const allowedKeys = [
      'personalInformation',
      'medicalHistory',
      'visionSymptoms',
      'currentVisionCorrection',
      'lifestyleVisualDemands',
      'additionalInformation',
    ];

    for (const response of responses) {
      const keys = Object.keys(response);
      for (const key of keys) {
        if (!allowedKeys.includes(key)) {
          return false;
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid response. Allowed keys are: personalInformation, medicalHistory, visionSymptoms, currentVisionCorrection, lifestyleVisualDemands, additionalInformation,';
  }
}
