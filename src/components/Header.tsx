/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useState } from 'react';
import { ErrorTp } from '../types/error';
import { Todo } from '../types/Todo';

type Props = {
  createNewTodo: (title: string) => void;
  setErrors:(error: ErrorTp | null) => void;
  todos: Todo[];
  handelToggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  createNewTodo,
  setErrors,
  todos,
  handelToggleAll,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 1) {
      setErrors(ErrorTp.title_error);
    } else {
      createNewTodo(title);
      setTitle('');
      setErrors(null);
    }
  };

  const someNotCompleted = todos.some(todo => !todo.completed);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: someNotCompleted })}
        data-cy="ToggleAllButton"
        onClick={handelToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};