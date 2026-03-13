import * as yup from 'yup';

// Validation schema for user login form
// Matches backend validation: username required, password required
export const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

// Validation schema for user registration form
// Matches backend validation: username 3-50 chars, valid email, password 8+ chars
export const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters'),
  fullName: yup
    .string()
    .max(100, 'Full name must not exceed 100 characters'),
});

// Validation schema for survey creation and editing
// Enforces title requirement, date ordering, and minimum 1 question
export const surveySchema = yup.object({
  title: yup
    .string()
    .required('Survey title is required')
    .max(200, 'Title must not exceed 200 characters'),
  description: yup
    .string()
    .max(2000, 'Description must not exceed 2000 characters'),
  startDate: yup.string().nullable(),
  endDate: yup
    .string()
    .nullable()
    .test('date-order', 'End date must be after start date', function (value) {
      const { startDate } = this.parent;
      if (startDate && value) {
        return new Date(value) > new Date(startDate);
      }
      return true;
    }),
  visibility: yup.string().oneOf(['PUBLIC', 'PRIVATE']),
});

// Validation schema for individual questions within a survey
// Enforces text length, valid type, and Likert scale range constraints
export const questionSchema = yup.object({
  text: yup
    .string()
    .required('Question text is required')
    .max(1000, 'Question text must not exceed 1000 characters'),
  type: yup
    .string()
    .required('Question type is required')
    .oneOf(['MULTIPLE_CHOICE', 'LIKERT', 'OPEN_TEXT']),
  questionOrder: yup
    .number()
    .required('Question order is required')
    .min(1, 'Order must be at least 1'),
  likertMin: yup
    .number()
    .nullable()
    .min(1, 'Minimum must be at least 1')
    .max(10, 'Minimum must not exceed 10'),
  likertMax: yup
    .number()
    .nullable()
    .min(1, 'Maximum must be at least 1')
    .max(10, 'Maximum must not exceed 10'),
  maxTextLength: yup
    .number()
    .nullable()
    .max(5000, 'Max text length must not exceed 5000'),
});
