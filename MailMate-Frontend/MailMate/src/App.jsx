import { useState } from 'react'
import './App.css'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
    background: { default: '#f5f6fb' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter","Segoe UI",Roboto,sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 },
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://mailmate-backend-5pch.onrender.com/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const tones = [
    { value: '', label: 'None' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'radial-gradient(1200px 600px at 10% -10%, #e0e7ff 0%, transparent 60%),' +
            'radial-gradient(1000px 500px at 110% 10%, #fce7f3 0%, transparent 55%),' +
            'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
          py: { xs: 4, md: 8 },
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 52, height: 52, borderRadius: 3,
                display: 'grid', placeItems: 'center',
                background: 'linear-gradient(135deg,#6366f1,#ec4899)',
                color: '#fff', boxShadow: '0 10px 25px rgba(99,102,241,.35)',
              }}
            >
              <MailOutlineIcon />
            </Box>
            <Box>
              <Typography variant="h3" component="h1">MailMate</Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered replies, drafted in your voice.
              </Typography>
            </Box>
          </Stack>

          {/* Composer */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid rgba(15,23,42,.06)',
              backdropFilter: 'blur(6px)',
              background: 'rgba(255,255,255,.75)',
            }}
          >
            <Typography variant="h6" gutterBottom>Original email</Typography>
            <TextField
              fullWidth
              multiline
              rows={7}
              placeholder="Paste the email you want to respond to…"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3, textAlign: 'right' }}>
              {emailContent.length} characters
            </Typography>

            <Typography variant="h6" gutterBottom>Tone</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              {tones.map((t) => (
                <Chip
                  key={t.value || 'none'}
                  label={t.label}
                  onClick={() => setTone(t.value)}
                  color={tone === t.value ? 'primary' : 'default'}
                  variant={tone === t.value ? 'filled' : 'outlined'}
                  sx={{ borderRadius: 2, px: 0.5 }}
                />
              ))}
            </Stack>

            {/* Kept Select as accessible fallback, hidden if you prefer chips only */}
            <FormControl fullWidth sx={{ mb: 3, display: 'none' }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                {tones.map((t) => (
                  <MenuItem key={t.value || 'none'} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              startIcon={!loading && <AutoAwesomeIcon />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg,#6366f1,#ec4899)',
                boxShadow: '0 10px 25px rgba(99,102,241,.35)',
                '&:hover': { background: 'linear-gradient(135deg,#4f46e5,#db2777)' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Generate reply'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {/* Result */}
          {generatedReply && (
            <Paper
              elevation={0}
              sx={{
                mt: 3, p: { xs: 3, md: 4 }, borderRadius: 4,
                border: '1px solid rgba(15,23,42,.06)',
                background: 'rgba(255,255,255,.75)',
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6">Generated reply</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => setGeneratedReply('')}
                    aria-label="clear"
                  >
                    <RestartAltIcon fontSize="small" />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => {
                      navigator.clipboard.writeText(generatedReply);
                      setCopied(true);
                    }}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Copy
                  </Button>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
              />
            </Paper>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
            Crafted with MailMate
          </Typography>
        </Container>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
            Copied to clipboard
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
