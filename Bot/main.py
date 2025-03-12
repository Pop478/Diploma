import os
from http.client import HTTPException
from typing import Union, List
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import StatesGroup, State
from aiogram.types import (
    ChatType, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery,
    KeyboardButton, ReplyKeyboardMarkup, ParseMode, ContentType, WebAppInfo, InputFile
)
from aiogram import types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import logging
import asyncpg
from datetime import datetime, timedelta
from aiogram.utils.callback_data import CallbackData
from aiogram.utils.exceptions import FileIsTooBig
from aiogram.utils.markdown import escape_md
from pydantic import BaseModel
import asyncio
from fastapi import FastAPI
from uvicorn import Config, Server

app = FastAPI()

API_TOKEN = '7736688982:AAHRHBOEwW25T6hoTbACEnA6jsGebkgeB6w'

logging.basicConfig(level=logging.INFO)

storage = MemoryStorage()
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot, storage=storage)

db_pool = None

class OrderState(StatesGroup):
    waiting_for_advertisement = State()

async def create_db_pool():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'Stepan110104'),
            database=os.getenv('DB_NAME', 'diploma'),
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            min_size=1,
            max_size=10
        )
        logging.info("Подключение к базе данных успешно создано")
    except Exception as e:
        logging.error(f"Ошибка подключения к базе данных: {e}")

@dp.message_handler(content_types=types.ContentType.VIDEO)
async def get_video_id(message: types.Message):
    await message.answer(message.video.file_id)  # Выведет новый file_id в консоль


from aiogram import types
import logging
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton

from aiogram import types
import logging
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton

@dp.message_handler(commands=['start'])
async def send_welcome(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or "Без имени"

    # Создаем Inline-клавиатуру с веб-сайтом
    inline_keyboard = InlineKeyboardMarkup().add(
        InlineKeyboardButton("Биржа", web_app=types.WebAppInfo(url="https://marusinohome.ru"))  # Замени ссылку
    )

    # Создаем Reply-клавиатуру
    button_orders = KeyboardButton('Профиль')
    button_tests = KeyboardButton('Тесты')
    button_athletes = KeyboardButton('Спортсмены')
    button_support = KeyboardButton('Поддержка')

    keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
    keyboard.add(button_orders, button_tests, button_athletes, button_support)

    # Текст приветствия
    text = (
        "<b>🚀 Добро пожаловать на биржу рекламы <a href='https://t.me/Carrot'>@Carrot</a></b>\n\n"
        "💼 Покупайте рекламу в <b>один клик!</b>\n"
        "💰 Резерв средств до выполнения заказа – <b>безопасная сделка</b>.\n"
        "📢 Продавайте рекламу в своих Telegram-каналах и зарабатывайте.\n"
        "💎 Зарабатывайте TON на своей аудитории прямо в Telegram!\n\n"
        "<b>📊 Быстро. Удобно. Надежно.</b>"
    )

    # Отправляем обычную клавиатуру перед видео
    await message.answer("Выберите действие:", reply_markup=keyboard)

    # Обработка реферальной ссылки
    args = message.get_args()
    trainer_id = None

    if args and args.startswith("ref"):
        try:
            trainer_id = int(args[3:])  # Извлекаем ID тренера
        except ValueError:
            trainer_id = None  # Игнорируем некорректные значения

    try:
        async with db_pool.acquire() as connection:
            if trainer_id:  # Проверяем, есть ли trainer_id, прежде чем делать запрос
                # Получаем ID тренера из таблицы trainers
                trainer = await connection.fetchrow(
                    "SELECT id FROM trainers WHERE user_id = $1",
                    trainer_id
                )

                if not trainer:
                    await message.answer("❌ Тренер не найден.")
                    return

                trainer_id = trainer["id"]  # Получаем ID тренера

                # Обновляем trainer_id у пользователя
                await connection.execute(
                    "UPDATE users SET trainer_id = $1 WHERE user_id = $2",
                    trainer_id, user_id
                )

                response = "🎉 Вы успешно добавлены в систему!"
                response += f"\nТеперь ваш тренер – пользователь с ID {trainer_id}."

                await message.answer(response)

    except Exception as e:
        logging.error(f"Ошибка при добавлении тренера: {e}")
        await message.answer("🚨 Произошла ошибка при добавлении тренера.")




@dp.message_handler(lambda message: message.text == "Профиль")
async def user_profile(message: types.Message):
    user_id = message.from_user.id

    try:
        # Получаем данные пользователя и проверяем его в trainers
        async with db_pool.acquire() as connection:
            user = await connection.fetchrow(
                """
                SELECT u.user_id, u.first_name, t.user_id AS trainer_id 
                FROM users u 
                LEFT JOIN trainers t ON t.user_id = u.user_id 
                WHERE u.user_id = $1
                """, 
                user_id
            )

        if not user:
            await message.answer("❌ Профиль не найден.")
            return

        # Формируем текст профиля
        response = (
            f"<b>👤 Профиль пользователя</b>\n\n"
            f"🆔 ID: {(user['user_id'])}\n"
            f"👤 Имя: {(user['first_name'])}\n"
        )

        # Создаем клавиатуру
        keyboard = types.InlineKeyboardMarkup(row_width=1)

        # Кнопка смены фото
        keyboard.add(types.InlineKeyboardButton(text="🖼 Сменить фото", callback_data="change_photo"))

        # Если пользователь есть в trainers, добавляем кнопку для получения ссылки
        if user["trainer_id"]:
            keyboard.add(types.InlineKeyboardButton(text="🔗 Ссылка для приглашения", callback_data="get_invite_link"))

        await message.answer(response, reply_markup=keyboard, parse_mode="HTML")

    except Exception as e:
        logging.error(f"Ошибка получения данных профиля: {e}")
        await message.answer("🚨 Произошла ошибка при получении данных профиля.")

@dp.callback_query_handler(lambda c: c.data == "get_invite_link")
async def send_invite_link(callback_query: types.CallbackQuery):
    user_id = callback_query.from_user.id
    invite_link = f"https://t.me/OrthoTest_bot?start=ref{user_id}"

    # Формируем новое сообщение с инвайт-ссылкой
    new_response = (
        f"<b>👤 Профиль пользователя</b>\n\n"
        f"🆔 ID: {user_id}\n"
        f"🔗 Ваша инвайт-ссылка:\n<code>{invite_link}</code>\n\n"
        f"Скопируйте ссылку и отправьте друзьям!"
    )

    await callback_query.message.edit_text(new_response, parse_mode="HTML")
    await callback_query.answer("🎉 Ваша инвайт-ссылка готова!")


@dp.message_handler(commands=['addtrainer'])
async def add_trainer_handler(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username

    # Получаем реферальный ID из команды /addtrainer ref<id>
    args = message.get_args()
    trainer_id = None

    if args and args.startswith("ref"):
        try:
            trainer_id = int(args[3:])  # Извлекаем ID тренера
        except ValueError:
            pass  # Если ID некорректный, игнорируем

    if not trainer_id:
        await message.answer("❌ Неверный формат команды. Используйте корректную ссылку.")
        return

    try:
        async with db_pool.acquire() as connection:
            # Добавляем тренера
            await connection.execute(
                "Update users SET trainer_id = $1",
                trainer_id
            )

            response = "🎉 Вы успешно добавлены в систему!"
            if trainer_id:
                response += f"\nТеперь ваш тренер – пользователь с ID {trainer_id}."

            await message.answer(response)

    except Exception as e:
        logging.error(f"Ошибка при обработке команды /addtrainer: {e}")
        await message.answer("🚨 Произошла ошибка при добавлении тренера.")



@dp.callback_query_handler(lambda callback_query: callback_query.data == "change_photo")
async def my_orders(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id

    try:
        async with db_pool.acquire() as connection:
            user = await connection.fetchrow(
                "SELECT uuid FROM users WHERE user_id = $1", user_id
            )

        if user:
            user_uuid = user['uuid']
            photos = await bot.get_user_profile_photos(user_id)

            if photos.total_count > 0:
                file_id = photos.photos[0][0].file_id
                file = await bot.get_file(file_id)
                file_path = file.file_path

                save_directory = 'static'
                if not os.path.exists(save_directory):
                    os.makedirs(save_directory)

                save_path = os.path.join(save_directory, f'user_{user_uuid}.png')

                # Удаляем старый файл, если он существует
                if os.path.exists(save_path):
                    os.remove(save_path)

                # Скачиваем новый файл
                await bot.download_file(file_path, save_path)

                await callback_query.message.answer("✅ Ваше фото успешно обновлено!")
            else:
                await callback_query.message.answer("❌ У вас нет фотографий в профиле.")
        else:
            await callback_query.message.answer("🚨 Вы не зарегистрированы в системе.")
    except FileIsTooBig:
        await callback_query.message.answer("❌ Ваше фото слишком большое для загрузки.")
    except Exception as e:
        logging.error(f"Ошибка при смене фото: {e}")
        await callback_query.message.answer("🚨 Произошла ошибка при смене фото.")


@dp.message_handler(lambda message: message.text == "Спортсмены")
async def show_athletes(message: types.Message):
    user_id = message.from_user.id

    try:
        async with db_pool.acquire() as connection:
            # Выполняем SQL-запрос для получения спортсменов, привязанных к тренеру
            athletes = await connection.fetch("""
                SELECT u.user_id, u.first_name 
                FROM users AS u
                JOIN groups g ON g.id = u.group_id
                JOIN trainers t ON t.id = g.trainer_id
                WHERE t.user_id = $1
            """, user_id)

        if not athletes:
            await message.answer("🚨 У вас нет привязанных спортсменов.")
            return

        # Создаём inline-клавиатуру с кнопками спортсменов
        keyboard = types.InlineKeyboardMarkup(row_width=1)
        for athlete in athletes:
            keyboard.add(types.InlineKeyboardButton(text=athlete["first_name"], callback_data=f"athlete_{athlete['user_id']}"))

        await message.answer("🏆 Ваши спортсмены:", reply_markup=keyboard)

    except Exception as e:
        logging.error(f"Ошибка получения списка спортсменов: {e}")
        await message.answer("🚨 Произошла ошибка при загрузке данных.")


@dp.callback_query_handler(lambda call: call.data.startswith("athlete_"))
async def show_athlete_info(call: types.CallbackQuery):
    athlete_id = int(call.data.split("_")[1])

    try:
        async with db_pool.acquire() as connection:
            # Запрос информации о конкретном спортсмене
            athlete = await connection.fetchrow(
                "SELECT first_name, last_name, rank, birth_date FROM users WHERE user_id = $1", athlete_id
            )

        if not athlete:
            await call.message.answer("🚨 Информация о спортсмене не найдена.")
            return

        # Проверяем, есть ли данные о спортсмене и корректируем их
        full_name = f"{athlete['first_name']} {athlete['last_name']}"
        rank = athlete['rank'] if athlete['rank'] else "Не указан"
        birth_date = athlete['birth_date'].strftime('%d.%m.%Y') if athlete['birth_date'] else "Не указана"

        # Формируем текст с информацией о спортсмене
        athlete_text = (
            f"🏅 <b>Спортсмен</b>\n\n"
            f"👤 <b>Имя:</b> {full_name}\n"
            f"🥇 <b>Звание:</b> {rank}\n"
            f"🎂 <b>Дата рождения:</b> {birth_date}\n"
        )

        await call.message.answer(athlete_text, parse_mode="HTML")
        await call.answer()

    except Exception as e:
        logging.error(f"Ошибка получения информации о спортсмене: {e}")
        await call.message.answer("🚨 Произошла ошибка при загрузке информации.")


# @dp.callback_query(dp.data == "change_photo")
# async def change_photo_callback(call: CallbackQuery, connection):
#     await call.message.answer("📸 Отправьте новое фото для профиля.")
#     await call.answer()

#     @dp.message(F.photo)
#     async def save_new_photo(message: Message, connection):
#         user_id = message.from_user.id
#         photo_id = message.photo[-1].file_id

#         await connection.execute("UPDATE users SET photo = $1 WHERE id = $2", photo_id, user_id)
#         await message.answer("✅ Фото успешно обновлено!")

#         # Обновляем профиль сразу после загрузки фото
#         user = await connection.fetchrow("SELECT id, name, registration_date, balance, photo FROM users WHERE id = $1", user_id)

#         profile_text = (
#             f"<b>👤 Профиль пользователя</b>\n\n"
#             f"🆔 ID: {(user['id'])}\n"
#             f"👤 Имя: {(user['name'])}\n"
#             f"📅 Дата регистрации: {(user['registration_date'])}\n"
#             f"💰 Баланс: {(user['balance'])} монет\n"
#         )

#         keyboard = InlineKeyboardMarkup(
#             inline_keyboard=[
#                 [InlineKeyboardButton(text="🖼 Сменить фото", callback_data="change_photo")]
#             ]
#         )

#         await message.answer_photo(
#             photo=photo_id,
#             caption=profile_text,
#             parse_mode="HTML",
#             reply_markup=keyboard
#         )

@dp.message_handler(commands=["menu"])
async def menu_handler(message: types.Message):
    user_id = message.from_user.id

    # Текст сообщения
    text = (
        f"👤 <b>Имя:</b> Strep\n"
        # f"💰 <b>Баланс:</b> 10 TON\n"
        f"📆 <b>Стаж:</b> 5 месяцев\n\n"
        "Выберите действие:"
    )

    # Inline-кнопки 4 кнопки, по 2 в ряд
    keyboard = types.InlineKeyboardMarkup(inline_keyboard=[
        [
            types.InlineKeyboardButton(text="📢 Рекламы", callback_data="ads"),
            types.InlineKeyboardButton(text="👤 Профиль", callback_data="profile"),
        ],
        [
            types.InlineKeyboardButton(text="📡 Каналы", callback_data="channels"),
            types.InlineKeyboardButton(text="🛠 Поддержка", callback_data="support"),
        ]
    ])

    await message.answer(text, reply_markup=keyboard, parse_mode="HTML")



# @dp.message_handler(commands=['myProfile'])
# async def send_welcome(message: types.Message):
#     user_id = message.from_user.id
#
#     pay_button = InlineKeyboardMarkup().add(
#         InlineKeyboardButton("Оплатить", web_app=WebAppInfo(url=f"https://tma.internal/user/4526c40d-3bb8-45ac-af4f-d751e64aceb3"))
#     )
#
#     await message.answer("Добро пожаловать! Выберите нужный пункт меню: тут(https://t.me/TeleAdMarketBot/tma.internal/user/4526c40d-3bb8-45ac-af4f-d751e64aceb3)", reply_markup=pay_button)




@dp.callback_query_handler(lambda callback_query: callback_query.data == "my_orders")
async def my_orders(callback_query: CallbackQuery):
    user_id = callback_query.from_user.id
    try:
        async with db_pool.acquire() as connection:
            orders = await connection.fetch(
                """SELECT o.order_id, o.total_price, o.status, o.created_at
                   FROM Orders o WHERE o.user_id = $1 AND status = 'waiting'
                   ORDER BY o.created_at DESC""", user_id
            )

            if orders:
                response = "Ваши заказы:"
                keyboard = InlineKeyboardMarkup()
                for order in orders:
                    formatted_price = f"{order['total_price']:,.0f}".replace(",", " ")
                    button_text = f"Заказ №{order['order_id']} - {formatted_price}ton."
                    callback_data = f"order_{order['order_id']}"
                    keyboard.add(InlineKeyboardButton(button_text, callback_data=callback_data))

                await callback_query.message.answer(response, reply_markup=keyboard)
            else:
                await callback_query.message.answer("У вас пока нет заказов.")
    except Exception as e:
        logging.error(f"Ошибка получения заказов: {e}")
        await callback_query.message.answer("Произошла ошибка при получении заказов.")



class OrderRequest(BaseModel):
    user_id: int
    order_id: int

@app.post('/order')
async def handle_order(order: OrderRequest):
    user_id = order.user_id
    order_id = order.order_id

    try:
        async with db_pool.acquire() as connection:
            result = await connection.fetchrow(
                """SELECT p.user_id
                   FROM Products p
                   JOIN OrderItems oi ON oi.product_id = p.product_id
                   JOIN Orders o ON o.order_id = oi.order_id
                   WHERE o.order_id = $1""", order_id
            )

        if result:
            target_user_id = result['user_id']

            # Отправляем сообщение пользователю
            await bot.send_message(
                user_id,
                "✅ Ваше рекламное предложение будет отправлено продавцу для утверждения. "
                "Отправьте сообщение для пересылки."
            )

            # Используем FSMContext через dispatcher, а не напрямую в FastAPI
            state = dp.current_state(user=user_id)
            await state.update_data(target_user_id=target_user_id, order_id=order_id)
            await state.set_state(OrderState.waiting_for_advertisement)

        else:
            await bot.send_message(user_id, "❌ Заказ с таким ID не найден.")
            return {"status": "error", "message": "Order not found"}

        return {"status": "success", "message": "Message sent and data saved"}

    except Exception as e:
        logging.error(f"❌ Ошибка при обработке запроса: {e}")
        raise HTTPException(status_code=500, detail=f"Произошла ошибка: {str(e)}")


async def start_fastapi():
    config = Config(app=app, host="0.0.0.0", port=5001, log_level="info")
    server = Server(config)
    await server.serve()

async def start_bot():
    # Запускаем бота без использования executor.start_polling
    await dp.start_polling(bot)

if __name__ == "__main__":
    async def main():
        # Инициализация базы данных
        await create_db_pool()

        # Параллельный запуск FastAPI и Aiogram
        await asyncio.gather(
            start_fastapi(),  # Запуск FastAPI
            start_bot()       # Запуск бота
        )

    asyncio.run(main())


