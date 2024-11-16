package processors

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/url"
)

// CreateRequest creates an HTTP request with the specified method, URL, headers, body data, and query parameters.
func CreateRequest(method, urlStr string, headers map[string]string, data interface{}, params map[string]string) (*http.Request, error) {
	// Add query parameters to the URL
	if len(params) > 0 {
		parsedURL, err := url.Parse(urlStr)
		if err != nil {
			return nil, err
		}
		query := parsedURL.Query()
		for key, value := range params {
			query.Set(key, value)
		}
		parsedURL.RawQuery = query.Encode()
		urlStr = parsedURL.String()
	}

	// Prepare the request body
	var body *bytes.Buffer
	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return nil, err
		}
		body = bytes.NewBuffer(jsonData)
	} else {
		body = &bytes.Buffer{}
	}

	// Create a new HTTP request
	req, err := http.NewRequest(method, urlStr, body)
	if err != nil {
		return nil, err
	}

	// Set headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	return req, nil
}


func DoRequest(req *http.Request, v interface{}) (interface{}, error) {
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    
    if err := json.NewDecoder(resp.Body).Decode(v); err != nil {
        return nil, err
    }

    return v, nil
}