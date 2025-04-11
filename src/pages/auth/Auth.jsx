import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';

const Auth = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [response, setResponse] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = {
            username: email,
            password: password,
        };

        // Логирование для отладки
        console.log(newData);

        try {
            // Если регистрация, то используем userService.create, иначе userService.auth
            const response = await (type === 'register'
                ? userService.create(newData)
                : userService.auth(newData));

            if (response) {
                console.log(response);
                // Сохраняем пользователя в локальное хранилище
                localStorage.removeItem('user');
                response.isAdmin == true ? navigate('/admin') : navigate('/home')
                localStorage.setItem('user', JSON.stringify(response));
            }
        } catch (error) {
            setResponse(true);
            console.error('Ошибка при отправке данных:', error);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setResponse(false);
      };

    const handleLoginChange = (e) => {
        setEmail(e.target.value);
        setResponse(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-white mb-6">
                    {type === 'register' ? 'Регистрация' : 'Авторизация'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {type === 'register' && (
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-white">
                                Введите ваше имя
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введите ваше имя"
                                className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-800 text-white"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            {type === 'register' ? 'Придумайте логин' : 'Логин'}
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={handleLoginChange}
                            placeholder="Введите вашу почту"
                            className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-800 text-white"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            {type === 'register' ? 'Придумайте пароль' : 'Пароль'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Введите ваш пароль"
                            className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-800 text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md transition"
                    >
                        {type === 'register' ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </form>
                <div className='text-red-500 pt-2'>{response ? 'Ошибка при отправке данных! Ошибка входа.' : null}</div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    {type === 'register' ? (
                        <>
                            Уже есть аккаунт?{' '}
                            <Link to="/auth" className="text-blue-400 hover:text-blue-300">
                                Войти
                            </Link>
                        </>
                    ) : (
                        <>
                            Нет аккаунта?{' '}
                            <Link to="/register" className="text-blue-400 hover:text-blue-300">
                                Зарегистрироваться
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
