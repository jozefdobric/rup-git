export class TrakoParsoClass {

theRow = 'incoming data';

makeSomeParso() {
    
    var parsed = TrakoParso(this.theRow);
    this.sectionArtist  = parsed.sectionArtist;
    this.sectionTitle   = parsed.sectionTitle;
    this.mainArtist     = parsed.mainArtist;
    this.trackTitle     = parsed.trackTitle;
    this.remixTitle     = parsed.remixTitle;
    this.featuredArtists= parsed.featuredArtists;
    
}

    
}

function TrakoParso(theRow) {
    

    var regexCommand;
    var regexWalls;
    var regexExcept;
    var regexResult;
    var parsed = {};
    
    // GET TWO PARTS
    regexWalls = [
        '\\W\\-\\W',
        '\\W\\-\\-\\W'
    ];
    regexResult = new RegExp(regexWalls.join('|'));
    [ parsed.sectionArtist, parsed.sectionTitle ] = theRow.split(regexResult);
    
    
    // GET MAIN ARTIST
    // LOGIC: 
    // [start] MAIN ARTIST [wall] ...
    regexWalls = [
        'feat\\.?', 
        'ft\\.?',
        '\\Wand\\W', 
        '\\&', 
        '\\(', 
        '\\)',
        '\\[', 
        '\\]',
        '\\W\\-\\W',
        '\\W\\-\\-\\W',
        '$'
    ];
    regexCommand = new RegExp( "^.*?(?="+regexWalls.join('|')+")" , "ig");
    regexResult = regexCommand.exec(theRow);
    parsed.mainArtist = ( regexResult ? regexResult[0].trim() : '' );
    
    
    // GET TRACK NAME
    // LOGIC (using tilte part):
    // [start] TRACK NAME [wall] or [end]
    regexWalls = [
        'feat\\.?', 
        'ft\\.',
        '\\(', 
        '\\)',
        '\\[', 
        '\\]',
        '$'
    ];
    regexCommand = new RegExp( "^.*?(?="+regexWalls.join('|')+")" , "ig");
    regexResult = regexCommand.exec(parsed.sectionTitle);
    parsed.trackTitle = ( regexResult ? regexResult[0].trim() : '' );
    
    
    // GET REMIX NAME
    // LOGIC
    // ... [brackets][no feat] remix name [brackets] [end]
    regexWalls = [
        '\\(', 
        '\\)',
        '\\[', 
        '\\]'
    ];
    regexExcept = [
        'feat\\.?', 
        'ft\\.'
    ];    
    regexCommand = new RegExp( "(?=.*)(?:"+regexWalls.join('|')+")(?!"+regexExcept.join('|')+").*?(?:"+regexWalls.join('|')+").*$" , "ig");
    regexResult = regexCommand.exec(parsed.sectionTitle);
    parsed.remixTitle = ( regexResult ? regexResult[0].trim() : '' );
    
    
    // GET FEATURED
    regexWalls = [
        'feat\\.?', 
        'ft\\.?',
        '\\Wand\\W', 
        '\\&', 
        '\\(', 
        '\\)',
        '\\[', 
        '\\]',
        '\\W\\-\\W',
        '\\W\\-\\-\\W',
        parsed.mainArtist.replace(" ", '\\s'),
        parsed.trackTitle.replace(" ", '\\s')
    ];
    
    regexCommand = new RegExp( regexWalls.join('|') );
    regexResult = theRow.split(regexCommand);
    parsed.featuredArtists = [];
    for ( var i in regexResult) {
        if ( regexResult[i].trim() != '' ) 
            parsed.featuredArtists.push( {'name':regexResult[i].trim(), 'position':i} );
    }
    
    return parsed;

}




console.log(`zl wrks 0.14`);
        