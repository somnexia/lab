from database import get_connection


def save_price(price):
    connection = get_connection()
    cursor = connection.cursor()

    query = """
    INSERT INTO btc_prices(price)
    VALUES(%s)
    """

    cursor.execute(query, (price,))
    connection.commit()
    cursor.close()
    connection.close()
