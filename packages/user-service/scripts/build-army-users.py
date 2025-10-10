import psycopg2
import sys

def generateUsers(numberOfUsers):
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
        for i in range(numberOfUsers):
            cur.execute("""
                INSERT INTO br7own.users(
                    id, username, email, exclusion_list, inclusion_list, challenge_response, created_at)
                VALUES (%s, %s, %s, '[]', '[]', '-', NOW())""", (psycopg2.extensions.AsIs(i), nameGroup+str(i), emailGroup+str(i)))

        conn.commit()
       
    	# close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


if "__main__" == __name__:
    usersToCreate = 24 # number of autobots https://www.imdb.com/title/tt0086817/trivia
    if len(sys.argv) > 1:
        try:
            usersToCreate = int(sys.argv[1])
        except ValueError:
            print("Expected an integer, but received " + sys.argv[1])
            exit()
    generateUsers(usersToCreate)