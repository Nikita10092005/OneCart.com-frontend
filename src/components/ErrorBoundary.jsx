import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() {
    if (this.state.failed) return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">This page could not load</h1>
          <p className="my-4">Please reload and try again.</p>
          <button className="rounded-lg bg-amazon-accent px-5 py-3 font-semibold" onClick={() => window.location.reload()}>Reload page</button>
        </div>
      </main>
    );
    return this.props.children;
  }
}
