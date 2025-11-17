import psycopg2

def deleteAllUsers():
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="bichard",
            user="bichard",
            password="password"
        )
        # create a cursor
        cur = conn.cursor()
        nameGroup = "AutoBot"
        emailGroup = "trans4m@auto.c"

	    # execute a statement
        cur.execute("DELETE FROM br7own.users")

        conn.commit()
       
    	# close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


if "__main__" == __name__:
    deleteAllUsers()