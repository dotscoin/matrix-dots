from configure_app import app

# class appRunner:
#     from apis import RouteRunner

if __name__ == '__main__':
    # appRunner = appRunner()
    app.run(host="0.0.0.0", port=8000)