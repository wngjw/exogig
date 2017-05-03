package app

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"path/filepath"
)

//GetNotifications writes the textfile to the server
func GetNotifications(w http.ResponseWriter, r *http.Request) {
	absPath, _ := filepath.Abs("../notifications.txt")
	data, err := ioutil.ReadFile(absPath)
	check_error(err)
	resultJSON, _ := json.Marshal(string(data))
	w.Write(resultJSON)
}
