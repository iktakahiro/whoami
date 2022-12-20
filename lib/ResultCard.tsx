import { Card, Text, Button } from '@nextui-org/react';

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

interface ResultCardProps {
  title: string;
  body: string;
}
export const ResultCard = (props: ResultCardProps) => {
  return (
    <Card variant='bordered'>
      <Card.Header>
        <Text b>{props.title}</Text>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <pre>{props.body}</pre>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Button onClick={() => copyToClipboard(props.body)} size='sm'>
          COPY
        </Button>
      </Card.Footer>
    </Card>
  );
};
