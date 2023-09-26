import { useState, forwardRef, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import { useSnackbar, SnackbarContent, CustomContentProps } from 'notistack';
import Collapse from '@mui/material/Collapse';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Alert, AlertTitle, Box, CardActions } from '@mui/material';

const useStyles = makeStyles(() => ({
  root: {
    '@media (min-width:600px)': {
      minWidth: '344px !important',
    },
  },
}));

interface ReportCompleteProps extends CustomContentProps {
  allowDownload?: boolean;
  hint?: string;
}

// Name should be changed.
const ReportComplete = forwardRef<HTMLDivElement, ReportCompleteProps>(({ id, ...props }, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  // Should be fixed, but works for the next demo.
  const Actions: any = typeof props.action === 'function' ? props.action : () => <></>;
  const severity =
    props.variant === 'unsavedChanges'
      ? 'warning'
      : props.variant === 'default'
      ? 'info'
      : props.variant;
  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card sx={{ width: '100%' }}>
        <Alert
          onClose={handleDismiss}
          severity={severity}
          action={
            props.action ? (
              <CardActions sx={{ pl: 2 }}>
                <Box sx={{ ml: 'auto' }}>
                  {props.action && (
                    <IconButton
                      aria-label="Show more"
                      sx={{
                        transition: 'all .2s',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      onClick={handleExpandClick}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={handleDismiss}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </CardActions>
            ) : undefined
          }
        >
          {props.hint ? (
            <>
              <AlertTitle>{props.message}</AlertTitle>
              {props.hint}
            </>
          ) : (
            props.message
          )}
        </Alert>
        {props.action && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Actions />
          </Collapse>
        )}
      </Card>
    </SnackbarContent>
  );
});

ReportComplete.displayName = 'ReportComplete';

export default ReportComplete;
