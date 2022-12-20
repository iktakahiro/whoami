import { Text, Table } from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface InfoTableProps {
  expires: Date;
}
export const InfoTable = (props: InfoTableProps) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      console.log(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [now]);
  return (
    <Table
      striped
      bordered
      sticked
      aria-label='expires of id token'
      headerLined
      lined
      css={{
        height: 'auto',
        width: '100%',
      }}
    >
      <Table.Header>
        <Table.Column>KEY</Table.Column>
        <Table.Column>VALUE</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row key='1'>
          <Table.Cell>Expires (ISO)</Table.Cell>
          <Table.Cell>{props.expires.toISOString()}</Table.Cell>
        </Table.Row>
        <Table.Row key='2'>
          <Table.Cell>Expires (Local)</Table.Cell>
          <Table.Cell>
            <Text color={props.expires > now ? 'success' : 'warning'}>{props.expires.toLocaleString()}</Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
