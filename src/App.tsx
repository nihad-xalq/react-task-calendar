/** @jsxImportSource @emotion/react */
import { Calendar } from './components/Calendar'
import styled from '@emotion/styled'
import { globalStyles } from './styles/GlobalStyles'

const AppContainer = styled.div`
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
`;

const Header = styled.header`
  background-image: linear-gradient(to bottom right, #1565c0, black);
  padding: 1rem 0;
  text-align: center;
`;

const Main = styled.main`
  // padding: 1rem;
  // max-width: 1300px;
  width: 90%;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 4rem;
`;

const App = () => {
  return (
    <div css={globalStyles}>
      <AppContainer>
        <Header>
          <Title>Calendar App</Title>
        </Header>
        <Main>
          <Calendar />
        </Main>
      </AppContainer>
    </div>
  );
};

export default App;
