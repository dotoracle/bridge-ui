import styled from 'styled-components/macro'

export const AppBoxWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem auto 0;
  border-radius: 40px;
  padding: 2rem 0;
  width: 100%;
  background-color: #0f0f1e;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);

  @media (min-width: 1200px) {
    flex-direction: row;
  }
`
export const FormWrap = styled.div`
  flex: 0 0 40%;
  padding-right: 1rem;
  padding-left: 2rem;
`
export const TableWrap = styled.div`
  flex: 0 0 60%;
  padding-left: 1rem;
  padding-right: 2rem;
`
export const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`
export const NetworkItem = styled.div`
  flex: 1 1 0;
`
export const ArrowImage = styled.img`
  margin: 0 1rem;
  width: 30px;

  @media (min-width: 768px) {
    margin: 0 1.15rem;
  }
`
export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 1rem;
  color: #aeaeb3;
`
export const Reminder = styled.div`
  color: #989898;

  ul {
    margin-top: 1rem;
    padding-left: 1.5rem;
  }

  li {
    list-style-type: disc;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
`
