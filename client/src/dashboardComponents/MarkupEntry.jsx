var MarkupEntry = (props) => {

  return (
    <div>
      <div className="author-label">{props.author}</div>
      <a target="_blank" href={props.url}>
        <div>{props.title}</div>
      </a>
    </div>
  );

};


window.MarkupEntry = MarkupEntry;
