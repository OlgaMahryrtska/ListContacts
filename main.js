$(document).ready(function () {
  $.getJSON("http://localhost/listContacts/read.php", function (json) {
    var tr = [];
    for (var i = 0; i < json.length; i++) {
      tr.push("<tr>");
      tr.push("<td>" + json[i].id + "</td>");
      tr.push("<td>" + json[i].name + "</td>");
      tr.push("<td>" + json[i].surname + "</td>");
      tr.push("<td>" + json[i].phone + "</td>");
      tr.push("<td>" + json[i].email + "</td>");
      tr.push(
        "<td><button class='edit'>Edit</button>&nbsp;&nbsp;<button class='delete' id=" +
          json[i].id +
          ">Delete</button></td>"
      );
      tr.push("</tr>");
    }
    $("table").append($(tr.join("")));
  });
  $(document).delegate(".add", "click", function (event) {
    event.preventDefault();
    let modal = $(".modal").css("display", "block");
  });
  $(document).delegate(".close", "click", (event) => {
    event.preventDefault();
    modal = $(".modal").css("display", "none");
  });
  $(document).delegate("#addNew", "click", function (event) {
    event.preventDefault();
    let name = $("#name").val(),
      surname = $("#surname").val(),
      phone = $("#phone").val(),
      email = $("#email").val();
    if (name == null || name == "") {
      alert("Wpisz imię!");
      return;
    } else if (surname == null || surname == "") {
      alert("Wpisz nazwisko!");
      return;
    }
    let regExp1 = /\d+/g,
      regExp2 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let validPhone = regExp1.test(phone);
    if (!validPhone) {
      alert("Poproszę wpisać poprawny numer telefonu!");
      return;
    }
    let validEmail = regExp2.test(email);
    if (!validEmail) {
      alert("Poproszę wpisać poprawny email!");
      return;
    }
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "http://localhost/listContacts/create.php",
      data: JSON.stringify({
        name: name,
        surname: surname,
        phone: phone,
        email: email,
      }),
      cache: false,
      success: function (result) {
        alert("Dodano do bazy danych!");
        location.reload(true);
      },
      error: function (err) {
        alert(err);
      },
    });
  });
  $(document).delegate(".delete", "click", function () {
    if (confirm("Naprawdę chcesz usunąć ten rekord?")) {
      var id = $(this).attr("id");
      var parent = $(this).parent().parent();
      $.ajax({
        type: "DELETE",
        url: "http://localhost/listContacts/delete.php?id=" + id,
        cache: false,
        success: function () {
          parent.fadeOut("slow", function () {
            $(this).remove();
          });
          location.reload(true);
        },
        error: function () {
          alert("Error deleting record");
        },
      });
    }
  });
  $(document).delegate(".edit", "click", function () {
    let parent = $(this).parent().parent(),
      id = parent.children("td:nth-child(1)"),
      name = parent.children("td:nth-child(2)"),
      surname = parent.children("td:nth-child(3)"),
      phone = parent.children("td:nth-child(4)"),
      email = parent.children("td:nth-child(5)"),
      buttons = parent.children("td:nth-child(6)");

    name.html("<input type='text' id='txtName' value='" + name.html() + "'/>");
    surname.html(
      "<input type='text' id='txtName' value='" + surname.html() + "'/>"
    );
    phone.html(
      "<input type='text' id='txtName' value='" + phone.html() + "'/>"
    );
    email.html(
      "<input type='text' id='txtName' value='" + email.html() + "'/>"
    );
    buttons.html(
      "<button id='save'>Save</button>&nbsp;&nbsp;<button class='delete' id='" +
        id.html() +
        "'>Delete</button>"
    );
  });

  $(document).delegate("#save", "click", function () {
    let parent = $(this).parent().parent(),
      id = parent.children("td:nth-child(1)"),
      name = parent.children("td:nth-child(2)"),
      surname = parent.children("td:nth-child(3)"),
      phone = parent.children("td:nth-child(4)"),
      email = parent.children("td:nth-child(5)"),
      buttons = parent.children("td:nth-child(6)");

    $.ajax({
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      url: "http://localhost/listContacts/update.php",
      data: JSON.stringify({
        id: id.html(),
        name: name.children("input[type=text]").val(),
        surname: surname.children("input[type=text]").val(),
        phone: phone.children("input[type=text]").val(),
        email: email.children("input[type=text]").val(),
      }),
      cache: false,
      success: function () {
        name.html(name.children("input[type=text]").val());
        surname.html(surname.children("input[type=text]").val());
        phone.html(phone.children("input[type=text]").val());
        email.html(email.children("input[type=text]").val());
        buttons.html(
          "<button class='edit' id='" +
            id.html() +
            "'>Edit</button>&nbsp;&nbsp;<button class='delete' id='" +
            id.html() +
            "'>Delete</button>"
        );
      },
      error: function () {
        alert("Error updating record");
      },
    });
  });
});
