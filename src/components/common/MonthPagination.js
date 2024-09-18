import { Button, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

const MonthPagination = ({ mois, annee, handlePreviousMonth, handleNextMonth }) => {
  return (
    <HStack spacing={4} justify="center" mb={4}>
      <Button onClick={handlePreviousMonth} color="black" shadow="lg" bg={'#ce0033'}>{'<'}</Button>
      <Text px={14} fontSize="lg" fontWeight="bold" color="black">
        {dayjs(`${annee}-${mois}-01`).format('MMMM YYYY')}
      </Text>
      <Button onClick={handleNextMonth} color="black" shadow="lg" bg={'#ce0033'}>{'>'}</Button>
    </HStack>
  );
};

export default MonthPagination;
