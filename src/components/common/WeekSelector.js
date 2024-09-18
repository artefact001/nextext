import { Button, HStack, Icon, Text } from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';

const WeekSelector = ({ semainesDuMois, selectedWeek, setSelectedWeek }) => {
  return (
    <HStack justify="center">
      {semainesDuMois.map((week) => (
        <Button
          display="block"  
          height="full" 
          py={2}       
          key={week.number}
          onClick={() => setSelectedWeek(week.number)}
          bg={selectedWeek === week.number ? '#CE0033' : '#000000'}
        //   border active
        //   border="2px solid"
        //   borderColor={selectedWeek === week.number? '#CE0033' : '#000000'}
          border="none"
          borderRadius="lg"
          shadow="md"
          _focus={{ outline: 'none' }}
          _hover={{ bg: '#CE0033', color: 'white' }}
          _active={{ bg: '#CE0033', color: 'white' }}
         
          lineHeight="1"
          transition="all 0.3s ease-in-out"
          _text={{ color: selectedWeek === week.number? 'white' : 'gray.300' }}
          _disabledText={{ color: 'gray.300' }}
          _icon
          color={selectedWeek === week.number ? 'white' : 'gray.300'}
        >
          <Icon size="xl" as={FaCalendarAlt} />
          <Text ml="-3">Semaine</Text>
        </Button>
      ))}
    </HStack>
  );
};

export default WeekSelector;
