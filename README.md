# ASP.NET Core Angular App : Windows Authentication Demo

A simple demonstration application showcasing Windows Authentication (Kerberos/NTLM) in a .NET Core backend with an Angular frontend for IIS.

* **Note regarding IIS Express:** For local development using IISExpress, Windows Authentication may not always work out-of-the-box, and additional changes might be needed. The following GitHub issue details potential problems and workarounds:
    > **GitHub Issue: [https://github.com/dotnet/aspnetcore/issues/39061](https://github.com/dotnet/aspnetcore/issues/39061)**
    >
    > You’ll need to configure this in the specific SPA proxy or frontend settings. I recommend checking the documentation for your framework or proxy setup — for example, if you're using React, Angular, or Vue, it’s often based on http-proxy-middleware.


## Core Technologies

* **Backend:** ASP.NET Core (using `AspNetCore.Authentication.Negotiate`)
* **Frontend:** Angular
* **Authentication:** Integrated Windows Authentication

## Purpose

This demo illustrates how to:
* Secure ASP.NET Core API endpoints using Windows Authentication.

## Prerequisites

* .NET 8.0
* Node.js & npm (e.g., LTS version)
* Windows machine (preferably domain-joined for full Kerberos testing)
* Visual Studio

## Quick Start

### 1. Backend (.NET Core) App

* **Configure Windows Auth:**
    * In `Properties/launchSettings.json`, ensure your IIS Express profile has:
        ```json
        "windowsAuthentication": true,
        "anonymousAuthentication": false
        ```
    * The `ASPNETCORE_HTTPS_PORT` in `launchSettings.json` (e.g., `7125`) is used by the frontend proxy.
* **Verify Services (`Program.cs`):**
    ```csharp
    builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme).AddNegotiate();
    builder.Services.AddAuthorization(options => options.FallbackPolicy = options.DefaultPolicy);
    // ...
    app.UseAuthentication();
    app.UseAuthorization();
    ```

### 2. Publish Backend to IIS and Enable Windows Auth There

* **Publish the Project:**
    * From Visual Studio (right-click project -> Publish) or use the .NET CLI:
        ```bash
        dotnet publish --configuration Release -o C:\publish\MyWebApp
        ```
        (Replace `C:\publish\MyWebApp` with your desired output folder).
* **Configure IIS:**
    1.  Open **Internet Information Services (IIS) Manager**.
    2.  In the **Connections** pane, right-click on **Sites** and select **Add Website...** (or add as an Application under an existing site).
    3.  Enter a **Site name** (e.g., `MyWebApp`), set the **Physical path** to your publish folder (e.g., `C:\publish\MyWebApp`).
    4.  Assign a **Port** (e.g., 8080, or use host headers for port 80/443). Ensure it doesn't conflict. Click **OK**.
    5.  **Application Pool:**
        * Go to **Application Pools**. Find the pool created for your site (usually named after your site).
        * Right-click -> **Advanced Settings...**. Ensure **.NET CLR version** is set to "No Managed Code" (ASP.NET Core runs as an out-of-process or in-process application handled by the ASP.NET Core Module).
        * The **Identity** of the Application Pool might need specific permissions depending on your resources. For Windows Auth, `ApplicationPoolIdentity` is often sufficient but may need network access or to run as a specific domain account for Kerberos delegation or accessing other network resources.
    6.  **Enable Windows Authentication:**
        * Select your newly created website/application in IIS Manager.
        * In the middle pane, double-click **Authentication**.
        * Ensure **Windows Authentication** is **Enabled**.
        * Ensure **Anonymous Authentication** is **Disabled**. (If Anonymous is enabled, Windows Auth might not trigger for all requests).
* **Browse** your site from IIS to ensure it starts correctly. You might need to install the ASP.NET Core Hosting Bundle on the server if not already present.

For production, ensure robust error handling, logging, and security best practices.
