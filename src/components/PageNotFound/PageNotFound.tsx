import './PageNotFound.scss';

export const PageNotFound = () => {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>Page not found. Try to go
        <a href="/"> home.</a>
      </p>
    </section>
  );
}