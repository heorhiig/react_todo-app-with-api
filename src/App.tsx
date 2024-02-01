/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo, USER_ID } from './types/Todo';
import { ErrorTp } from './types/error';
import { createTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Errors } from './components/Errors';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorTp | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.all);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrors(ErrorTp.load_error));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filterTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.completed:
        return todos.filter(todo => !todo.completed);

      case FilterType.active:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterType]);

  const addTodo = (title: string) => {
    createTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then((newTodo) => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, newTodo]);
      })
      .catch(() => ErrorTp.title_error);
  };

  const updatingTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(uptodo => uptodo.id === updatedTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      });
  };

  const handelChangFilter = (filter: FilterType) => {
    setFilterType(filter);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header createNewTodo={addTodo} setErrors={setErrors} />

        <TodoList
          onUpdate={updatingTodo}
          setTodos={setTodos}
          todos={filterTodos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterChange={handelChangFilter}
            filterType={filterType}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors errors={errors} />
    </div>
  );
};
