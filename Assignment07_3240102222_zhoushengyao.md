##  **Project Background and Objective**

In this project, the objective was to design and implement a **Vector class** in C++. The **Vector class** is a dynamic array-like container that allows storing and managing elements. The class must support various operations such as adding elements, accessing them, and dynamically resizing the underlying storage. Additionally, the class must be equipped with basic operations like checking the size, clearing the contents, and handling exceptions related to out-of-bounds access.

The goal was to implement:

- A dynamic array that grows as more elements are added.
- Safe access to elements with bounds checking.
- Support for various methods like adding elements, resizing, and clearing the vector.

## **Design and Implementation**

**Attributes**:

- `m_pElements`: A pointer to the dynamically allocated array that stores the elements.
- `m_nSize`: The current size of the vector (the number of elements stored).
- `m_nCapacity`: The total capacity of the vector (the number of elements the vector can hold before resizing).

**Methods**:

- **Constructors**:
  - **Default constructor**: Initializes an empty vector with size 0 and capacity 0.
  - **Parameterized constructor**: Initializes a vector with a given size.
  - **Copy constructor**: Creates a new vector by copying the elements from another vector.
- **Destructor**: Responsible for deallocating the dynamically allocated memory.
- **Core methods**:
  - **push_back**: Adds a new element to the end of the vector. If the vector’s capacity is reached, it triggers resizing (doubling the capacity).
  - **at**: Provides bounds-checked access to an element, throwing an exception if the index is invalid.
  - **operator[]**: Provides unchecked access to elements by index.
  - **size**: Returns the number of elements in the vector.
  - **clear**: Removes all elements by resetting the size to 0.
  - **empty**: Checks if the vector has any elements.

##  **Testing and Results**

The program was tested using various operations on the `Vector` class to verify the correctness of the implementation. The following tests were performed:

1. **Adding elements (`push_back`)**:
   - Elements were added to the vector, and the size was checked to ensure it increased correctly.
   - The vector resized automatically when it reached capacity.
2. **Accessing elements (`operator[]` and `at()`)**:
   - Elements were accessed using both the `operator[]` (unchecked) and `at()` (with bounds checking).
   - The `at()` method was tested to ensure it threw an exception for invalid indices.
3. **Clearing the vector (`clear`)**:
   - The vector was cleared using the `clear()` method, and the size was checked to ensure it was reset to 0.
4. **Checking if the vector is empty (`empty`)**:
   - The `empty()` method was tested to confirm it correctly indicated whether the vector contained elements.

![image-20251213172320943](/Users/zhoushengyao/Library/Application Support/typora-user-images/image-20251213172320943.png)