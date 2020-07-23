import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO } from 'date-fns';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import * as SC from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>(`/appointments/me`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAppointments(
          response.data.map(item => {
            return { ...item, hour: format(parseISO(item.date), 'hh:mm') };
          }),
        );
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => {
        return monthDay.available === false;
      })
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [monthAvailability, currentMonth]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  return (
    <SC.Container>
      <SC.Header>
        <SC.HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <SC.Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Welcome,</span>
              <strong>{user.name}</strong>
            </div>
          </SC.Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </SC.HeaderContent>
      </SC.Header>

      <SC.Content>
        <SC.Schedule>
          <h1>Schedule</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{format(selectedDate, 'd MMMM')}</span>
            <span>{format(selectedDate, 'cccc')}</span>
          </p>
          <SC.NextAppointment>
            <strong>Next service</strong>
            <div>
              <img
                src="https://avatars0.githubusercontent.com/u/42596775?s=460&u=8ddc06cf5793a75d7e7ad462ddfed52b8ef4d503&v=4"
                alt="Ivan Seibel"
              />
              <strong>Ivan Seibel</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </SC.NextAppointment>

          <SC.Section>
            <strong>Morning</strong>

            {morningAppointments.map(appointment => (
              <SC.Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </SC.Appointment>
            ))}
          </SC.Section>

          <SC.Section>
            <strong>Afternoon</strong>

            {afternoonAppointments.map(appointment => (
              <SC.Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </SC.Appointment>
            ))}
          </SC.Section>
        </SC.Schedule>
        <SC.Calendar>
          <DayPicker
            weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            selectedDays={[selectedDate]}
            onMonthChange={handleMonthChange}
          />
        </SC.Calendar>
      </SC.Content>
    </SC.Container>
  );
};

export default Dashboard;
