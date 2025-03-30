import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "todos";

const TodoComponent = ({ primaryColor = "#8F9EFF" }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // Ref to store deletion timers for todos keyed by todo id
  const deletionTimers = useRef({});

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setTodos(JSON.parse(jsonValue));
      } else {
        // Set default todos if none are stored
        const initialTodos = [
          {
            id: "1",
            text: "Welcome to our Standby clock app.",
            completed: false,
          },
          {
            id: "2",
            text: "Swipe left or right to switch pages",
            completed: false,
          },
          {
            id: "3",
            text: "Long-press or pinch to open settings",
            completed: false,
          },
          {
            id: "4",
            text: "Double tap to enable sleep mode",
            completed: false,
          },
          {
            id: "5",
            text: "Thank you for using our app...",
            completed: false,
          },
        ];
        setTodos(initialTodos);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const saveTodos = async (todosToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todosToSave));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") return;
    const newEntry = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    const updatedTodos = [...todos, newEntry];
    setTodos(updatedTodos);
    setNewTodo("");
    await saveTodos(updatedTodos);
    Keyboard.dismiss();
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        const toggledTodo = { ...todo, completed: !todo.completed };
        // If marking as complete, schedule deletion after 2 seconds
        if (toggledTodo.completed) {
          deletionTimers.current[id] = setTimeout(() => {
            deleteTodo(id);
            delete deletionTimers.current[id];
          }, 2000);
        } else {
          // If toggled back to incomplete, cancel any scheduled deletion
          if (deletionTimers.current[id]) {
            clearTimeout(deletionTimers.current[id]);
            delete deletionTimers.current[id];
          }
        }
        return toggledTodo;
      }
      return todo;
    });
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => toggleTodo(item.id)}
      style={styles.todoItem}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: primaryColor },
          item.completed && { backgroundColor: primaryColor },
        ]}
      />
      <Text
        style={[styles.todoText, item.completed && styles.todoTextCompleted]}
      >
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What's your goal today?"
          placeholderTextColor="#aaa"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity onPress={addTodo} style={[styles.addButton]}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TodoComponent;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: "70%",
  },
  inputContainer: {
    marginTop: 7,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    marginRight: "20%",
    paddingRight: "10%",
  },
  textInput: {
    flex: 1,
    height: 44,
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 5,
    color: "#fff",
  },
  addButton: {
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "300",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 15,
  },
  todoText: {
    color: "#aaa",
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  todoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
});
