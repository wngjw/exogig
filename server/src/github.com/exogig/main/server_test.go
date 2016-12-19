/**
* server_test.go
*
* A test class for the functionality of the main server logic.
*
* Author: Tony Wang
*
* Date Modified: 10 Dec 2016
*/
package main

import (
	"fmt"
	"github.com/exogig/gig"
)

/*
* Description: Test code for verifying a comparator for two songs.
* This comparison fails because song names are case sensitive.
*
* Use: All tests can be run using command: <go test>.
* This command must be run from the package the code is in, or the package
* must be specified explicitly.
*
* Expected output:
* Upon a successful run of a go test, the expected response is "ok",
* along with a timed benchmark of how long the function took to run.
*/
func ExampleSongComparison() {
  songA := gig.Song{ Name:"My Heart Will Go On", Rating:1 }
  songB := gig.Song{ Name:"My Heart will Go On", Rating:1 }
  sameSong := songA.CompareSong(&songB)
  if (sameSong) {
    fmt.Println("songA matches songB")
  } else {
    fmt.Println("songA does not match songB")
  }
  // Output:
  // songA does not match songB
}

/**
* Description: This tests to see if the MongoDB is up and running
* It will succeed if the connection is setup as default and fail otherwise
* 
* Useage: go test 
* this test will be run in the suite of tests in this package
* 
* Expected Output:
* This should succeed because the MongoDB should be running on the server. 
*/
func ExampleServerConnection() {
  session, err := mgo.Dial("127.0.0.1")
  if err != nil {
    panic(err)
    fmt.println("connection error")
  } else {
    fmt.println("connection successful")
  }
  //Output:
  //connection successful
}
	
