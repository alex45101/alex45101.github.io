<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="FreeStyleWeb.Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <h1>Welcome to Free Style</h1>
        <p>This website will generate some fire for you by pressing the fire button</p>
    </div>
        <asp:Button ID="fireButton" runat="server" Text="Fire" OnClick="fireButton_Click" />
        <asp:Label ID="Label1" runat="server" Text="Label"></asp:Label>
    </form>
</body>
</html>
