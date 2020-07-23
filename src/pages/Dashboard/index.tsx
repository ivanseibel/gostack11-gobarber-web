import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import * as SC from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface monthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    monthAvailabilityItem[]
  >([]);

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
            <span>Today</span>
            <span>Day 06</span>
            <span>Monday</span>
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

            <SC.Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/42596775?s=460&u=8ddc06cf5793a75d7e7ad462ddfed52b8ef4d503&v=4"
                  alt="Ivan Seibel"
                />

                <strong>Ivan Seibel</strong>
              </div>
            </SC.Appointment>

            <SC.Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/42596775?s=460&u=8ddc06cf5793a75d7e7ad462ddfed52b8ef4d503&v=4"
                  alt="Ivan Seibel"
                />

                <strong>Ivan Seibel</strong>
              </div>
            </SC.Appointment>
          </SC.Section>

          <SC.Section>
            <strong>Afternoon</strong>

            <SC.Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/42596775?s=460&u=8ddc06cf5793a75d7e7ad462ddfed52b8ef4d503&v=4"
                  alt="Ivan Seibel"
                />

                <strong>Ivan Seibel</strong>
              </div>
            </SC.Appointment>
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
