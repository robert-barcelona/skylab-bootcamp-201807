'use strict'

describe('logic (spotify-app)', () => {
    describe('user\'s', () => {

        describe('register user', () => {
            const username = 'robert-anthony-' + Math.random(), password = '123'

            it('should register on correct data', () => {
                return logic.registerUser(username, password)
                    .then(id => {
                        expect(id).toBeDefined()
                    })
            })
        })

        describe('login user', () => {
            const username = 'robert-anthony-' + Math.random(), password = '123'
            let userId

            beforeEach(() => {
                return logic.registerUser(username, password)
                    .then(id => userId = id)
            })

            it('should login on correct data', () => {
                return logic.loginUser(username, password)
                    .then(res => {
                        expect(res).toBeTruthy()

                        expect(logic.userId).toBe(userId)
                        expect(logic.userToken).toBeDefined()
                        expect(logic.userUsername).toBe(username)
                    })
            })
        })

        describe('unregister user', () => {
            const username = 'robert-anthony-' + Math.random(), password = '123'

            beforeEach(() => {
                return logic.registerUser(username, password)
                    .then(() => logic.loginUser(username, password))
            })

            it('should unregister on correct data', () => {
                return logic.unregisterUser(password)
                    .then(res => {
                        expect(res).toBeTruthy()
                    })
            })
        })

        describe('logout user', () => {
            const username = 'robert-anthony-' + Math.random(), password = '123'

            beforeEach(() => {
                return logic.registerUser(username, password)
                    .then(() => logic.loginUser(username, password))
            })

            it('should logout correctly', () => {
                expect(logic.userId).toBeDefined()
                expect(logic.userToken).toBeDefined()
                expect(logic.userUsername).toBeDefined()

                logic.logout()

                expect(logic.userId).toBeNull()
                expect(logic.userToken).toBeNull()
                expect(logic.userUsername).toBeNull()
            })
        })

      describe('update user', () => {
        const username = 'robert-anthony-' + Math.random()
        const password = '123'
        const newUsername = "bubbles-" + Math.random();
        const newPassword = "onehundred"

        beforeEach(() => {
          return logic.registerUser(username, password)
            .then(() => logic.loginUser(username, password))
        })

        it('should update correctly', () => {
          expect(logic.userId).toBeDefined()
          expect(logic.userToken).toBeDefined()
          expect(logic.userUsername).toBeDefined()
         return logic.updateUser(password,newUsername,newPassword)
           .then((res) => {
             expect(res).toBeTruthy();
             expect(logic.userUsername).toBe(newUsername);
           }).then(()=> {
             return logic.loginUser(newUsername,newPassword)
               .then((res) => {
                 expect(res).toBeTruthy()
               });
           }).catch(console.error)

        })
      })


  describe('store user data', () => {
    let username = 'robert-anthony-' + Math.random()
    const password = '123'
    const dataArray = [{a:"b",c:"d",obj:{something:"else"}}]
    const dataObj = {something:{is:"different"}}
    const dataFieldName = "favorites"

    beforeEach(() => {
      username = 'robert-anthony-' + Math.random()
      return logic.registerUser(username, password)
        .then(() => logic.loginUser(username, password))
    })

    it('should store an array of data correctly', () => {
      expect(logic.userId).toBeDefined()
      expect(logic.userToken).toBeDefined()
      expect(logic.userUsername).toBeDefined()
      return logic.storeUserData(password,dataFieldName,dataArray)
        .then((res) => {
          expect(res).toBeTruthy();
        }).then(()=> {
          return logic.retrieveUserData(password,dataFieldName)
            .then((res) => {
              expect(res).toEqual(dataArray)
            });
        }).catch(console.error)

    })

    it('should store object data correctly', () => {
      expect(logic.userId).toBeDefined()
      expect(logic.userToken).toBeDefined()
      expect(logic.userUsername).toBeDefined()
      return logic.storeUserData(password,dataFieldName,dataObj)
        .then((res) => {
          expect(res).toBeTruthy();
        }).then(()=> {
          return logic.retrieveUserData(password,dataFieldName)
            .then((res) => {
              expect(res).toEqual(dataObj)
            });
        }).catch(console.error)

    })
  })

  describe('retrieve user data', () => {
    let username = 'robert-anthony-' + Math.random()
    const password = '123'
    const dataArray = [{a:"b",c:"d"}]
    const dataObj = {something:{is:"different"}}
    const dataFieldNameArray = "favorites"
    const dataFieldNameObject = "favoriteObject"

    beforeEach(() => {
      username = 'robert-anthony-' + Math.random()
      return logic.registerUser(username, password)
        .then(() => logic.loginUser(username, password))
        .then(() => {
          return logic.storeUserData(password,dataFieldNameArray,dataArray)
        })
        .then(() => {
          return logic.storeUserData(password,dataFieldNameObject,dataObj)
        })
    })

    it('should retrieve an array of data correctly', () => {
      expect(logic.userId).toBeDefined()
      expect(logic.userToken).toBeDefined()
      expect(logic.userUsername).toBeDefined()
      return logic.retrieveUserData(password,dataFieldNameArray)
        .then((res) => {
          expect(res).toEqual(dataArray);
        })
        .catch(console.error)

    })


    it('should retrieve object data correctly', () => {
      expect(logic.userId).toBeDefined()
      expect(logic.userToken).toBeDefined()
      expect(logic.userUsername).toBeDefined()
      return logic.retrieveUserData(password,dataFieldNameObject)
        .then((res) => {
          expect(res).toEqual(dataObj);
        })
        .catch(console.error)

    })
  })



})

    describe('spotify\'s', () => {
        logic.spotifyToken = 'BQDx2aI411JXqbjQlLQdGEucFwuU-YbmzNkcU6iaZLoTCr8iUGa_ceysrPbJEfMtUCK3B4S46ho4azyR3iM8VWm4ULRULKMB6NcuqQo-vpy1X5F---gjX16M4GrfJCaYlal2lNFsC6uD';

        describe('search artists', () => {
            it('should find artists matching criteria', () => {
                return logic.searchArtists('madonna')
                    .then(artists => {
                        expect(artists).toBeDefined()
                        expect(artists.length).toBe(20)
                        expect(artists[0].name).toBe('Madonna')
                        expect(artists[0].type).toBe('artist')
                    })
            })
        })

        describe('retrieve albums by artist id', () => {
            it('should retrieve albums for given artist id', () => {
                return logic.retrieveAlbumsByArtistId('4BH2S4t8fh9YqRIXnEEDEN')
                    .then(albums => {
                        expect(albums).toBeDefined()
                        expect(albums.length).toBe(3)
                        expect(albums[0].name).toBe('Hunter')
                        expect(albums[0].type).toBe('album')
                    })
            })
        })

        describe('retrieve tracks by album id', () => {
            it('should retrieve tracks for given album id', () => {
                return logic.retrieveTracksByAlbumId('7lnYU1xXbEiKPTZk3ltDE2')
                    .then(tracks => {
                        expect(tracks).toBeDefined()
                        expect(tracks.length).toBe(1)
                        expect(tracks[0].name).toBe('Hunter')
                        expect(tracks[0].type).toBe('track')
                    })
            })
        })

        describe('retrieve track by id', () => {
            it('should retrieve track for given id', () => {
                return logic.retrieveTrackById('4QxwXcPUm1VfkHksz6VuFi')
                    .then(track => {
                        expect(track).toBeDefined()
                        expect(track.name).toBe('Hunter')
                        expect(track.type).toBe('track')
                    })
            })
        })
    })
})