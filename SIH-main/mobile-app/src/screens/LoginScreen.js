import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { authService } from '../services/api'
import { setAuthToken } from '../services/api'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Email and password required')
      return
    }
    setLoading(true)
    try {
      const { data } = await authService.login({ email, password })
      await setAuthToken(data?.token)
      onLogin?.(data)
    } catch (error) {
      console.error('Login failed', error)
      Alert.alert('Login failed', error?.response?.data?.message || 'Check credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>SIH Field Login</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#64748b" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={[styles.button, loading && styles.disabled]} onPress={loading ? undefined : submit}>
          {loading ? 'Signing in...' : 'Login'}
        </Text>
        <Text style={styles.note}>Uses the same `/api/auth/login` endpoint as the web dashboard.</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0b1120',
    padding: 20,
  },
  card: {
    backgroundColor: '#111c30',
    padding: 24,
    borderRadius: 16,
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
  },
  button: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
  note: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
})

