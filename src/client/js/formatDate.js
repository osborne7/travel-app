//change date from yyyy-dd-mm to mm-dd-yyyy
const formatDate = function(input) {
    let pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
        return null;
    }
    return input.replace(pattern, '$2/$3/$1');
    };

export { formatDate }