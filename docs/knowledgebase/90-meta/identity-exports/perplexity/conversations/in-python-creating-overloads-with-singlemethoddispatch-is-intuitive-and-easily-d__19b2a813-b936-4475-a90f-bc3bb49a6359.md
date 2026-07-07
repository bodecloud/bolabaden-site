---
source_url: "https://www.perplexity.ai/search/cb082e40-ec3e-4188-b2e7-59f8f86d07f0"
thread_uuid: "19b2a813-b936-4475-a90f-bc3bb49a6359"
slug: "cb082e40-ec3e-4188-b2e7-59f8f86d07f0"
title: "in python, creating overloads with singlemethoddispatch is intuitive and easily. Does such an implementation exist for non-class functions?"
extracted_at: "2026-06-29T16:23:09.655Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in python, creating overloads with singlemethoddispatch is intuitive and easily. Does such an implementation exist for non-class functions?

Source: [Perplexity thread](https://www.perplexity.ai/search/cb082e40-ec3e-4188-b2e7-59f8f86d07f0)

## User

in python, creating overloads with singlemethoddispatch is intuitive and easily. Does such an implementation exist for non-class functions?

## Assistant

Yes, Python provides a similar implementation for non-class functions called `singledispatch`. It allows you to create function overloads based on the type of the first argument, much like `singledispatchmethod` does for class methods. Here's how you can use it:

## Using singledispatch for Function Overloading

The `singledispatch` decorator from the `functools` module allows you to create generic functions with different implementations based on the type of the first argument.[1]

Here's how to use it:

1. Import the decorator:

```python
from functools import singledispatch
```

2. Define your base function and decorate it with `@singledispatch`:

```python
@singledispatch
def fun(arg, verbose=False):
    if verbose:
        print("Let me just say,", end=" ")
    print(arg)
```

3. Register overloaded implementations using the `register()` attribute:

```python
@fun.register(int)
def _(arg, verbose=False):
    if verbose:
        print("Strength in numbers, eh?", end=" ")
    print(arg)

@fun.register(list)
def _(arg, verbose=False):
    if verbose:
        print("Enumerate this:")
    for i, elem in enumerate(arg):
        print(i, elem)
```

Now you can call `fun()` with different types of arguments:

```python
fun("Hello, world.")
fun(42, verbose=True)
fun(['spam', 'spam', 'eggs', 'spam'], verbose=True)
```

## Additional Features

1. **Checking Dispatch**: You can use the `dispatch()` attribute to check which implementation will be used for a given type:[1]

```python
print(fun.dispatch(float))
print(fun.dispatch(dict))
```

2. **Accessing Registered Implementations**: Use the `registry` attribute to access all registered overloads:[1]

```python
print(fun.registry.keys())
print(fun.registry[float])
print(fun.registry[object])
```

3. **Decorator Stacking**: `singledispatch` supports decorator stacking, allowing you to register multiple types for the same implementation:[6]

```python
from decimal import Decimal

@fun.register(float)
@fun.register(Decimal)
def _(s, verbose=False):
    if verbose:
        print("Handling a number:")
    print(round(s, 2))
```

## Advantages of singledispatch

1. It provides a clean way to implement function overloading in Python.
2. It allows you to keep the overloaded implementations separate from the main function definition.
3. It works well with type hints and annotations.

## Limitations

1. Dispatching is based only on the type of the first argument.
2. It doesn't support dispatching on complex types like `List[int]`.[4]

In summary, `singledispatch` offers an intuitive and flexible way to implement function overloading for non-class functions in Python, similar to how `singledispatchmethod` works for class methods.

### Sources

- [PEP 443 – Single-dispatch generic functions | peps.python.org](https://peps.python.org/pep-0443/)
  - This PEP proposes a new mechanism in the functools standard library module that provides a simple form of generic programming known as single-dispatch ...
- [Generic Function in Python with Singledispatch - Reddit](https://www.reddit.com/r/Python/comments/88xkh6/generic_function_in_python_with_singledispatch/)
  - Something to add - it's important not to use this @singledispatch or @x.register(y) directly on instance methods. Consider the below: class Foo @singledispatch def bar(self, value): ... @bar.register(Foo) def _(self, value): ... The above will fail for two reasons Here, we are trying to register the class containing the overloaded functions. This will fail because we haven't finished defining the class yet. More fundamentally - single dispatch looks at the type of the first argument. When you...
- [What is the singledispatchmethod() decorator in Python?](https://www.educative.io/answers/what-is-the-singledispatchmethod-decorator-in-python)
  - functools module The module in Python allows us to create higher-order functions that interact with other functions. The higher-order functions either return other functions or operate on them to broaden the functions’ scope without modifying or explicitly defining them. functools singledispatchmethod decorator The is used for method classes overloading. The functionality is similar to the singledispatchmethod decorator singledispatch decorator. However, the dispatch is based on the type of...
- [singledispatch on arguments that are themselves types/classes](https://github.com/python/cpython/issues/100623)
  - ### bswck commented Jan 2, 2023 bswckcommented I had a similar feature idea some time ago. I must admit that whenever I had needed to make a my_dispatch = singledispatch(default_case_function) def my_function(cls, *args, kwargs): return my_dispatch.dispatch(cls)(cls, *args, kwargs) my_function.register = my_dispatch.register No doubts that it's a bit of a workaround, and it works for me. But being honest, the presented idea of ... It instantiates a dummy object that returns the specified class...
- [singledispatch - PyPI](https://pypi.org/project/singledispatch/3.4.0.0/)
  - This library brings functools.singledispatch from Python 3.4 to Python 2.6-3.3.... ## Project description PEP 443 proposed to expose a mechanism in the functools standard library module in Python 3.4 that provides a simple form of generic programming known as single-dispatch generic functions. This library is a backport of this functionality to Python 2.6 - 3.3. To define a generic function, decorate it with the @singledispatch decorator. Note that the dispatch happens on the type of the first...
- [Function overloading with singledispatch-functools - GeeksforGeeks](https://www.geeksforgeeks.org/function-overloading-with-singledispatch-functools/)
  - Function overloading with singledispatch-functools Last Updated : 26 Mar, 2020 Summarize Comments Improve Suggest changes Like Article Like Save Share Report Follow Single-dispatch generic function decorator transforms a function into a generic function, which can have different behaviours depending upon the type of its first argument. The decorated function acts as the default implementation. To add overloaded implementations to the function, use the register() attribute of the generic...
- [jaraco/singledispatch - GitHub](https://github.com/jaraco/singledispatch)
