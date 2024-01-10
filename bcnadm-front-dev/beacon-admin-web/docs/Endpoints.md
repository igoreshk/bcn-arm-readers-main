# How to change the backend endpoint

1.  Find entities to change
    All endpoints are stored in the folder [service](/beacon-admin-web\src\main\resources\web\js\service).

We have a description of how it was and how it should be, like:

from:

```
| GET /buildings/{buildingId}/levels/{levelId}/places/{placeId}
```

to

```
 GET /places/{placeId}
```

So, need to find a module that contains methods for Places.

2.  Make necessary changes

**_Example_**

was

```jsx
PlaceService.findOne = (buildingId: String, levelId: String, placeId: String) =>
  axios
    .get(
      linkBuilder()
        .building(buildingId)
        .and()
        .level(levelId)
        .and()
        .place(placeId)
        .and()
        .build()

```

is

```jsx
PlaceService.findOne = (placeId: String) =>
  axios
    .get(
      linkBuilder()
        .place(placeId)
        .and()
        .build()


```

Sometimes, we need to change the text of the URL, for this we need to find the file for changes in [UrlBuilders](/beacon-admin-web\src\main\resources\web\js\utils\UrlBuilders) folder.

3.  Find methods in code, that use this endpoint and make necessary changes

**_Example_**

was

```jsx
getDto(buildingId: String, levelId: String, placeId: String): Promise {
    return new Promise((resolve) => {
      PlaceService.findOne(buildingId, levelId, placeId)
        .then((place) => {
          resolve(place);
        })
```

is

```jsx
 getDto(buildingId: String, levelId: String, placeId: String): Promise {
    return new Promise((resolve) => {
      PlaceService.findOne(placeId)
        .then((place) => {
          resolve(place);
        })
```

now for this endpoint we only need the PlaceId, we delete the rest of the arguments. `getDto` is a method from another logic module and we do not change it.

To see more about endpoints you can visit swagger pages and read about **(VPN required)**:

- [UAA Service](http://bcn-dev.lab.epam.com/api/v1/uaa-service/swagger/swagger-ui.html#/)

- [Building Service](http://bcn-dev.lab.epam.com/api/v1/building-service/swagger/swagger-ui.html#/)

- [Monitor Service](http://bcn-dev.lab.epam.com/api/v1/monitor-service/swagger/swagger-ui.html#/)

- [Trilateration Service](http://bcn-dev.lab.epam.com/api/v1/trilateration-service/swagger/swagger-ui.html#/)

- [Mobile Service](http://bcn-dev.lab.epam.com/api/v1/mobile-service/swagger/swagger-ui.html#/)
