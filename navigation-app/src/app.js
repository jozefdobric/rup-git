export class TrakoParsoClass {
    
out = {};
sgg = {};

constructor() {
    this.reset();
    console.log(`zl wrks 0.16.3`);
}

getSuggestions() {
    this.sgg = TrakoParsoTri(this.out.input);
    if (this.sgg.ready) this.showSuggestions(true);
    else this.showSuggestions(false);
}

showSuggestions(show) {
    if (show) {
        $('#SuggestionMessage').slideDown("fast");
        this.sgg.isMinimized = false;
    } else {
        $('#SuggestionMessage').slideUp("fast");
        if (this.sgg.ready) this.sgg.isMinimized = true;
    }    
}

insertSuggestions(skip) {
    this.showSuggestions(false);
    if (skip == 'skip') return false;
    this.out.featArtists = [];
    for ( var i in this.sgg.data )
        if ( this.sgg.data[i].isChecked ) {
            switch( this.sgg.data[i].code ) {
                case 'trackTitle':
                    this.out.trackTitle = this.sgg.data[i].val;
                break;
                case 'remixTitle':
                    this.out.remixTitle = this.sgg.data[i].val;
                break;
                case 'mainArtist':
                    this.out.mainArtist = this.sgg.data[i].val;
                break;
                case 'featArtist':
                    this.out.featArtists.push({'val':this.sgg.data[i].val});
                break;
            }
        }
}

addNewRowForFeatured() {
    this.out.featArtists.push({val:''})
}

getResult() {
    console.log('Output result:');
    console.log(this.out);
    alert('Output was printed in console');
}

reset() {
    this.out = {
        'input':            '',
        'trackTitle':       '',
        'remixTitle':       '',
        'mainArtist':       '',
        'featArtists':      [
            {'val':''}
        ],
        'author':           '',
        'composer':         ''
    };
    this.sgg = {
        'ready':        false,
        'isMinimized':  false,
        'data':         []
    };
    this.showSuggestions(false);
}

pasteRandomTest() {
    var testValues = [
    'Mark Ronson feat. Bruno Mars - Uptown Funk (Radio Edit)',
    'Red Mystery - Jetlands (Ron Flatter & Nick D-Lite Edit)',
    'Bill Withers & Grover Washington - Just the Two of Us',
    'M. Ward - Me and My Shadow (feat. Zooey Deschanel)',
    'Clean Bandit - Rather Be (feat. Jess Glynne) [The Magician Remix]',
    'Ana Tijoux - Somos Sur (Feat Shadia Mansour)',
    'Tove Lo - Stay High ft. Hippie Sabotage.mp3',
    'Rameses_B_-_Spirit_Walk_Original_Mix_(get-tune.net).mp3',
    '11_the_bug_-_poison_dart_feat_warrior_queen.mp3'
    ];
    this.reset();
    this.out.input = testValues[Math.floor(Math.random()*testValues.length)];
    this.getSuggestions();
    
}

}




function TrakoParsoTri(inputRow){
    var captionText = {
        'trackTitle':'track title',
        'remixTitle':'remix title',
        'mainArtist':'main artist',
        'featArtist':'featured artist'
    };
    var rwp = {
        'div':  '\\W\\-\\W|\\W\\-\\-\\W',   // section divider
        'ft':   'feat\\.?|ft\\.?',          // feat wall
        'br':   '\\(|\\)|\\[|\\]',          // brackets
        'and':  '\\Wand\\W|\\&',            // 'and' wall
        'eos':  '$'                         // end of string
    };
    var prs = {
        'base':inputRow,
        'section': {
            'artist':'',
            'title':''
        },
        'mainArtist':'',
        'trackTitle':'',
        'remixTitle':'',
        'featuredArtists':[]
    };
    
    var suggestion = {
        'ready':        false,
        'isMinimized':  false,
        'data':         []
    };
    
    // step0: clear input    
    prs.base = prs.base.replace(/_/g," ");
    prs.base = prs.base.replace(/(\.mp3)$/i,"");
    
    
    // step1: get sections
    [ prs.section.artist, prs.section.title ] = prs.base.split( RegExp(rwp.div) );
    if ( !prs.section.title ) return suggestion;
    
    
    // step2: get mainArtist
    [prs.mainArtist] = RegExp( "^.*?(?="+[rwp.div,rwp.ft,rwp.br,rwp.and,rwp.eos].join("|")+")" , "ig").exec(prs.base) || [''];
    
    
    // step3: get track title
    [prs.trackTitle] = ( prs.section.title ? RegExp( "^.*?(?="+[rwp.ft,rwp.br,rwp.eos].join("|")+")" , "ig").exec(prs.section.title) || [''] : ['']);

    
    // step4: get remix title
    [prs.remixTitle] = RegExp( "(?=.*)(?:"+rwp.br+")(?!"+rwp.ft+").*?(?:"+rwp.br+").*$" , "ig").exec(prs.base) || [''];
    prs.remixTitle = prs.remixTitle.replace(RegExp(rwp.br,"g"),'').trim();

    
    // step5: get featured
    if (prs.mainArtist) rwp.artist  = prs.mainArtist.replace(" ", '\\s');
    if (prs.trackTitle) rwp.title   = prs.trackTitle.replace(" ", '\\s');
    var unf = prs.base.split( RegExp([rwp.div,rwp.ft,rwp.br,rwp.and,rwp.artist,rwp.title].join("|"), "i" ) );
    for ( var i in unf ) 
        if ( unf[i].trim() ) {
            prs.featuredArtists.push({ 
                'val':          unf[i].trim().replace(/(remix|edit)$/ig, ''),
                'caption':      captionText.featArtist,
                'code':         'featArtist',
                'isChecked':    true
            });
        }
    
    
    // step6:formatting    
    if( prs.trackTitle ) {
        suggestion.data.push({
            'val':          prs.trackTitle,
            'caption':      captionText.trackTitle,
            'code':         'trackTitle',
            'isChecked':    true
        });
        suggestion.ready = true;
    }
    if( prs.remixTitle ) {
        suggestion.data.push({
            'val':          prs.remixTitle,
            'caption':      captionText.remixTitle,
            'code':         'remixTitle',
            'isChecked':    true
        });
    }
    if( prs.mainArtist ) {
        suggestion.data.push({
            'val':          prs.mainArtist,
            'caption':      captionText.mainArtist,
            'code':         'mainArtist',
            'isChecked':    true
        });
        suggestion.ready = true;
    }
    for ( var j in prs.featuredArtists ) suggestion.data.push( prs.featuredArtists[j] );
    
    return suggestion;

}
