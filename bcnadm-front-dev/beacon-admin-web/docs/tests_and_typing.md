# Type checking in project.

We use propTypes to check types. It is better to cover all props with typing and indicate which ones are required.

Flow is legacy code, it can be not supported and it is better to delete it if Flow is in the module that you are changing.

---

# Unit tests.

How to understand which module should be covered with tests:

- Is it a new component or an old one? If new, then it is desirable to cover with tests.

- Good candidates for testing if we make changes to existing code:

  - acceptance criteria for the task (we test first of all: for example, if we add a dropdown, we check that a dropdown is rendered)
  - event handlers (for example, we check the state change)
  - pure functions
  - utils functions
  - branches (if, try / catch, etc)

- Visualization changes - make a snapshot.

- If we change the hierarchy of blocks , we don't have to write a test.

Test design:

- write as simply as possible (= understandable)
- write a small number of tests, but so that they cover as many cases as possible
- it is better to use AAA - arrange, act, assert (test writing technique) Example:

```jsx
// arrange ->
const props = {
  translate: jest.fn(),
  isValid: false,
  history: {},
  allReaders: ['firstTestName', 'secondTestName', 'thirdTestName', 'forthTestName']
};

// act ->
const wrapper = shallow(<ReaderDialog {...props} />);

// assert ->
() => expect(wrapper.length).toEqual(1);
```

- write clear descriptions of tests so that it is clear from the description what the test does and when: for example, what triggers a method call.

```jsx
describe('validation reader name test', () => {  // describe is block about what is testing here
  it('should return that field shouldn"t be empty', () => { // it is block about what are we checking for.
// some code
  });
};
```

There can be more than one `it` block inside a `describe` block.
