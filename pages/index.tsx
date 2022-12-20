import Head from 'next/head';
import { Text, Input, Spacer, Button, Container, Grid, Loading, Textarea } from '@nextui-org/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useState } from 'react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { FirebaseError } from 'firebase/app';
import { MailIcon, PasswordIcon } from '../lib/Icon';
import { ResultCard } from '../lib/ResultCard';
import { InfoTable } from '../lib/InfoTable';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idToken, setIdToken] = useState('');
  const [decodedJwt, setDecodeJwt] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expires, setExpires] = useState<Date>();

  const onSubmit = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idTokenString = await result.user.getIdToken();
      const decoded = jwtDecode<JwtPayload>(idTokenString);

      const expires = new Date(decoded.exp! * 1000);
      setExpires(expires);
      setDecodeJwt(JSON.stringify(decoded, null, 2));
      setIdToken(idTokenString);
    } catch (e) {
      setIdToken('');
      if (e instanceof FirebaseError) {
        setErrorMessage(e.message);
      } else if (e instanceof Error) {
        setErrorMessage(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const formValid = () => {
    return email != '' && password != '';
  };
  return (
    <Container lg justify='center'>
      <Spacer y={4} />
      <Head>
        <title>Firebase ID Token Checker</title>
      </Head>

      <Text
        h1
        css={{
          textGradient: '45deg, $purple600 -20%, $pink600 100%',
        }}
      >
        Firebase ID Token Viewer
      </Text>
      <Grid.Container gap={2} justify='center' alignItems='center' alignContent='center'>
        <Grid xs={12}>
          <Input
            clearable
            rounded
            bordered
            required
            placeholder='enter your email'
            label='Email'
            value={email}
            autoComplete='on'
            type='email'
            onChange={(event) => setEmail(event.target.value)}
            width='360px'
            contentLeft={<MailIcon fillColor='currentColor' />}
          />
        </Grid>
        <Grid xs={12}>
          <Input.Password
            clearable
            rounded
            bordered
            required
            placeholder='enter your password'
            label='Password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            width='360px'
            contentLeft={<PasswordIcon fillColor='currentColor' />}
          />
        </Grid>
        {errorMessage != '' && (
          <Grid xs={12}>
            <Textarea
              readOnly
              minRows={1}
              maxRows={2}
              width='360px'
              label='Error'
              value={errorMessage}
              status='error'
            />
          </Grid>
        )}
        <Spacer y={1} />
        <Grid xs={12}>
          {formValid() ? (
            <Button rounded shadow color='gradient' onClick={isLoading ? undefined : onSubmit}>
              {isLoading ? <Loading color='currentColor' size='sm' /> : 'Who am I'}
            </Button>
          ) : (
            <Button disabled rounded shadow color='gradient' onClick={onSubmit}>
              Who am I
            </Button>
          )}
        </Grid>
        <Spacer y={2} />
        {idToken != '' && (
          <>
            <Grid xs={12}>
              <InfoTable expires={expires!} />
            </Grid>
            <Grid xs={12}>
              <ResultCard title='ID Token' body={idToken} />
            </Grid>
            <Grid xs={12}>
              <ResultCard title='JWT' body={decodedJwt} />
            </Grid>
          </>
        )}
      </Grid.Container>
      <Spacer y={4} />
    </Container>
  );
}
