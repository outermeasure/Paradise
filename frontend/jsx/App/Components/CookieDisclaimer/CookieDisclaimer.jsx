import React from 'react';
import CookieBanner from 'react-cookie-banner';

const styles = {
  button: {
    border: '0',
    borderRadius: 2,
    width: 104,
    height: 32,
    lineHeight: '32px',
    background: '#FF5722',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    opacity: 1,
    right: 20,
    marginTop: -18
  },
  message: {
    display: 'block',
    padding: '10px 30px',
    lineHeight: 1.3,
    textAlign: 'left',
    marginRight: 150,
    color: 'white'
  },
  link: {
    textDecoration: 'underline',
    fontWeight: 'bold'
  }
}

class CookieDisclaimer extends React.Component {

	render() {
		return <div>
        <CookieBanner
            styles={styles}
            message={"Confidentialitatea ta este importanta pentru noi si vrem sa fim transparenti ! \n\n Utilizam cookie-uri pentru a optimiza functionalitatea site-ului web, a imbunatati experienta de navigare, a se interactiona cu retele de socializare si pentru buna functionare a chat-ului. Prin clic pe butonul \"DA, ACCEPT\" acceptati utilizarea modulelor cookie."}
            link={<a href='https://protectia-datelor.eu/legislatie-gdpr/' target='_blank' ><br/><br/>Informatii suplimentare</a>}
            buttonMessage={'DA, ACCEPT'}
            dismissOnScroll={false}
        />
		</div>;
	}
};


export default CookieDisclaimer;
