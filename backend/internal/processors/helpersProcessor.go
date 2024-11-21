package processors

import (
	"encoding/json"
	"fmt"
	"net/url"
	"strings"

	"github.com/valyala/fasthttp"
)

// PerformRequest sends an HTTP request using fasthttp with the specified method, URL, headers, body, and query parameters.
func PerformRequest(method, urlStr string, headers map[string]string, data interface{}, params map[string]string, v interface{}) error {
	req := fasthttp.AcquireRequest()
	resp := fasthttp.AcquireResponse()
	defer fasthttp.ReleaseRequest(req) // Release request after execution
	defer fasthttp.ReleaseResponse(resp)

	// Add query parameters to the URL
	if len(params) > 0 {
		parsedURL, err := url.Parse(urlStr)
		if err != nil {
			return err
		}
		query := parsedURL.Query()
		for key, value := range params {
			query.Set(key, value)
		}
		parsedURL.RawQuery = query.Encode()
		urlStr = parsedURL.String()
	}

	req.SetRequestURI(urlStr)
	req.Header.SetMethod(strings.ToUpper(method))

	// Add headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Prepare the request body
	if data != nil {
		jsonData, err := json.Marshal(data)
		if err != nil {
			return err
		}
		req.SetBody(jsonData)
		req.Header.Set("Content-Type", "application/json")
	}

	// Perform the HTTP request
	client := &fasthttp.Client{}
	err := client.Do(req, resp)
	if err != nil {
		return err
	}

	// Check for non-200 status codes
	if resp.StatusCode() != fasthttp.StatusOK {
		return fmt.Errorf("request failed with status code %d: %s", resp.StatusCode(), resp.Body())
	}

	// Unmarshal the response body into the provided struct
	if err := json.Unmarshal(resp.Body(), v); err != nil {
		return err
	}

	return nil
}
