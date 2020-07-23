import React from 'react';

import { FiPower, FiClock } from 'react-icons/fi';
import * as SC from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

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
        </SC.Schedule>
      </SC.Content>
    </SC.Container>
  );
};

export default Dashboard;
