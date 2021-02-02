import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';

export const Wrapper = styled.div`
    margin: 40px;
`;

export const StyledButton = styled(IconButton)`
    position: fixed;
    z-index: 50;
    right: 10px;
    top: 10px;
`;