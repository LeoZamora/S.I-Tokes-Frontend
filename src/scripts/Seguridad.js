

export function existsInString(string, id) {

  let per = string.split(',')

  return per.some(r => r === id)

}

/*DEVUELVE TRUE SI EL IDMENU SE ENCUENTRA EN EL TOKEN
* DEL USUARIO LOGEADO, DE LO CONTRARIO, FALSE. */
export function hasAccessToMenu(idMenu) {

  const token = JSON.parse(localStorage.getItem('token'))
  var menus = ''

  if (token.usuario) {
    menus = token.ventanasAcceso
    return existsInString(menus, idMenu)
  } else {
    return
  }

}

export function hasAccessToFunct(idFunct) {

  const token = JSON.parse(localStorage.getItem('token'))

  var functs = ''
  if (token.usuario) {
    functs = token.permisos
    return existsInString(functs, idFunct)
  } else {
    return
  }

}
