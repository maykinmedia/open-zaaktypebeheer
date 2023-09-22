import { Alert, AlertTitle, Button } from '@mui/material';
import { ErrorAlertProps } from '../../types/types.tsx';

const ErrorAlert = ({ title, message }: ErrorAlertProps) => {
  return (
    <Alert
      severity="error"
      action={
        <Button
          size="small"
          color="error"
          onClick={() => window.location.reload()}
          sx={{ alignSelf: 'flex-end' }}
        >
          Herlaad pagina
        </Button>
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

export default ErrorAlert;
