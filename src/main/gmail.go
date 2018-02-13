package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
)

// getClient uses a Context and Config to retrieve a Token
// then generate a Client. It returns the generated Client.
func getClient(ctx context.Context, config *oauth2.Config, appState *ApplicationState) *http.Client {
	cacheFile := tokenCacheFile(appState)
	tok, err := tokenFromFile(cacheFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(cacheFile, tok)
	}
	return config.Client(ctx, tok)
}

// getTokenFromWeb uses Config to request a Token.
// It returns the retrieved Token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)

	var code string
	if _, err := fmt.Scan(&code); err != nil {
		log.Printf("Unable to read authorization code %v", err)
	}

	tok, err := config.Exchange(oauth2.NoContext, code)
	if err != nil {
		log.Printf("Unable to retrieve token from web %v", err)
	}
	return tok
}

// tokenCacheFile generates credential file path/filename.
// It returns the generated credential path/filename.
func tokenCacheFile(appState *ApplicationState) string {
	return *appState.Configuration.GmailAccessToken
}

// tokenFromFile retrieves a Token from a given file path.
// It returns the retrieved Token and any read error encountered.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	t := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(t)
	defer f.Close()
	return t, err
}

// saveToken uses a file path to create a file and store the
// token in it.
func saveToken(file string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", file)
	f, err := os.OpenFile(file, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Printf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func setupGmail(appState *ApplicationState) {
	if appState.Configuration.GmailAccessToken == nil ||
		appState.Configuration.GoogleApiClientSecret == nil ||
		appState.Configuration.GoogleApiKey == nil {
		return
	}
	ctx := context.Background()

	b, err := ioutil.ReadFile(*appState.Configuration.GoogleApiClientSecret)
	if err != nil {
		log.Printf("Unable to read client secret file: %v", err)
		return
	}

	config, err := google.ConfigFromJSON(b, gmail.GmailSendScope)
	if err != nil {
		log.Printf("Unable to parse client secret file to config: %v", err)
		return
	}
	appState.GmailClient = getClient(ctx, config, appState)
}

func SendEmail(client *http.Client, msg EmailMessage) {
	srv, err := gmail.New(client)
	if err != nil {
		log.Printf("Unable to retrieve gmail Client %v", err)
	}

	var message gmail.Message
	temp := []byte("From: " + msg.From + "\r\n" +
		"Reply-To: " + msg.ReplyTo + "\r\n" +
		"Content-Type: text/html; charset=UTF-8\r\n" +
		"To:  " + msg.To + "\r\n" +
		"Subject: " + msg.Subject + "\r\n" +
		"\r\n" + msg.Body)

	message.Raw = base64.StdEncoding.EncodeToString(temp)
	message.Raw = strings.Replace(message.Raw, "/", "_", -1)
	message.Raw = strings.Replace(message.Raw, "+", "-", -1)
	message.Raw = strings.Replace(message.Raw, "=", "", -1)
	_, err = srv.Users.Messages.Send("me", &message).Do()
	if err != nil {
		log.Printf("Unable to send. %v", err)
	}
}
