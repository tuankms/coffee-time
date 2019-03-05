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
A UserId is a document ID in a collection. Assume UserId is the same User.*fullName* and unique in a whole system.

A User.*relationship* field represents persons already coffee with this User

### Solution
My approach is that I try to limit the number of requests to the BE by keeping the whole Users data on client side. We will get some advantages points:
 - Limit the price can be charged by Firebase (document reads, writes, bandwidth)
 - Reduce BE processing
 - Fast responses to Client behavior happen on UI

One performance issue can happen if the Users data is too big. But in the context of this application, the number of employees in a company should small, so even fetching thousands of data can be accepted on the client side.

### Implementation 
#### Fetch Users and find a partner
All Users will be fetched for the first time a page opens. We then only send a request to BE when:
- Update User's relationship
- Create new User

When User_A enters his/her name and click "Spin Spin ..." button, we will find list of persons who never get coffee with a User_A. Then randomly pick one person (example User_B) and do two things:
- Add User_B to User_A's relationship
- Add User_A to User_B's relationship

That means User_A and User_B will coffee together :)

#### Signup
User also signup by clicking "Signup" link. The system will find a person that User can coffee with immediately righ after entering a username.

### Component design approach
I follow "Container and Presentational components" design and avoid have too many unrelated functions inside a component. We can put that "unrelated" functions in service/util or break to other components.

