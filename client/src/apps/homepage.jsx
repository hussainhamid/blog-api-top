export default function Homepage() {
  return (
    <>
      <p>this is the homepage.</p>

      <div>
        <p>this is login div.</p>

        <form>
          <div>
            <label htmlFor="username">username</label>
            <input type="text" className="username"></input>
          </div>

          <div>
            <label htmlFor="password">password</label>
            <input type="password" className="password"></input>
          </div>
        </form>
      </div>
    </>
  );
}
