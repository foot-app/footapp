export const clearUserInfo = () => {
    $('#searchedUser-info-name').text('')
    $('#searchedUser-info-nickname').text('')
    $('#fut7-positions').text('')
    $('#futsal-positions').text('')
    $('#searchedUser-img').attr('src', '').attr('alt', '')
    $('#searchedUser-info-row').hide()
}

export const clearSearch = () => {
    $('#userSearch').val('')
    $('#userSearch-list').hide()
}