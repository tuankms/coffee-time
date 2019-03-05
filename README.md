# Coffee Time

### Project Structure

```sh
+ src/
+ --- asset/ --> static resources (imgs...)
+ --- components/ --> all UI components stay here
+ --- services/ --> CRUD operations or business logic should stay here
+ --- utils/
+ --- views/ --> View can be a page such as Home page, Contact page... A view is a collection of components
+ --- firebase.js
+ --- firebaseConfiguration.js
+ --- App.vue
+ --- main.js --> A root file of applicaiton

+ tests/ --> Contain all unit tests
+ .env.[mode] --> Environment configuration
+ vue.config.js --> A vue configuration file
```

### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd coffee-time
$ yarn install
$ yarn serve
```

For running unit test (with watch mode)

```sh
$ yarn test:unit
```

Compiles and minifies for production

```sh
$ yarn build 
```

### Data model
```sh
+ users (collection)
+ --- userId_1 (document)
+ --- userId_2 (document)
+ --- + ---- fullName (field:string)
+ --- + ---- relationship (field:array)
+ --- + ---- + --- 'userId_1' (string)
```
A User is represented by a User object as below:
```sh
{
    useId_1: {
        fullName: 'userId_1',
        relationship: [
            'userId_2'
        ]
    }
}
```
A UserId is a document ID in a collection. Assume UserId is the same User.fullName and unique in whole system.

### Solution
My approach is that I try to limit the number of requests to the BE by keeping the whole Users data on client side. We will get some advantages points:
 - Limit the price can be charged by Firebase (document reads, writes, bandwidth)
 - Reduce BE processing
 - Fast responses to Client behavior happen on UI

One performance issue can happen if the Users data is too big. But in the context of this application, the number of employees in a company should small, so even fetching thousands of data can be accepted on the client side.

The implementation is that all Users will be fetched at the first time a page opens. We only send request to BE when:
- Update User's relationship
- Create new User

### Component design approach
I follow "Container and Presentational components" design.

