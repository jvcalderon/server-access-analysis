Server Access Analysis (exercise)
=================================

## Exercise description

### Main goal

- Parse a given [log file](./resources/epa-http.txt) and generate a new file in JSON format.
- Provide an UI to render log results as graphic charts within following information:
    - Requests per minute over the entire time span
    - Distribution of HTTP methods (GET, POST, HEAD,...)
    - Distribution of HTTP response codes (200, 404, 302,...)
    - Distribution of the size of the response of all requests with code 200 and size < 1000B
    
### Log format

| Name          | Description                                                                                                                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| host          | Host making the request. A hostname when possible, otherwise the Internet address if the name could not be looked up                                                                                       |
| datetime      | Date in the format "[DD:HH:MM:SS]", where DD is either "29" or "30" for August 29or August 30, respectively, and HH:MM:SS is the time of day using a 24-hourclock. Times are EDT (four hours behind GMT). |
| request       | Request given in quotes                                                                                                                                                                                   |
| response_code | HTTP reply code.                                                                                                                                                                                          |
| document_size | bytes in the reply.                                                                                                                                                                                       |
    
### To keep in mind

- Ensure that all records are being imported
- Sanitize wrong characters

