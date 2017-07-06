package convolvr_test

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"

	"encoding/json"

	"github.com/convolvr/convolvr"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("HTTP API", func() {
	var c http.Client

	BeforeEach(func() {
		c = http.Client{}
	})

	Describe("Users Resource", func() {
		var user convolvr.User

		BeforeEach(func() {
			user = convolvr.User{
				Name:     "Test User",
				Password: "Test Password!@#",
				Email:    "test@convolvr.io",
			}
		})

		It("should create a user", func() {
			userBytes, err := json.Marshal(&user)
			Expect(err).To(BeNil())

			userEndpoint := apiURL + "/users"
			fmt.Println("User Endpoint", userEndpoint)
			res, err := c.Post(userEndpoint, "application/json", bytes.NewBuffer(userBytes))
			Expect(err).To(BeNil())
			defer res.Body.Close()

			respBytes, err := ioutil.ReadAll(res.Body)
			Expect(err).To(BeNil())

			Expect(res.StatusCode).To(Equal(http.StatusOK))

			createdUser := convolvr.User{}
			err = json.Unmarshal(respBytes, &createdUser)
			Expect(err).To(BeNil())

			Expect(createdUser.ID).ToNot(Equal(0))
			Expect(createdUser.Name).To(Equal(user.Name))
			Expect(createdUser.Password).To(Equal(user.Password))
			Expect(createdUser.Email).To(Equal(user.Email))
		})
	})
})
